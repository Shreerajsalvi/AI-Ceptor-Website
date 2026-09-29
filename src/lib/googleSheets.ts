import { google } from "googleapis";
import db from "@/lib/db";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not configured");
  }
  return spreadsheetId;
}

async function getSheetId(spreadsheetId: string, sheetName: string = "Sheet1"): Promise<number> {
  try {
    const response = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = response.data.sheets?.find(
      (s) => s.properties?.title?.toLowerCase() === sheetName.toLowerCase()
    );
    return sheet?.properties?.sheetId ?? 0;
  } catch {
    return 0;
  }
}

function formatISTFromDate(date: Date): string {
  const istParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const istMap = new Map(istParts.map((p) => [p.type, p.value]));
  return `${istMap.get("year")}-${istMap.get("month")}-${istMap.get("day")} ${istMap.get("hour")}:${istMap.get("minute")}:${istMap.get("second")}`;
}

export function formatISTDate(val: Date | string | number | null | undefined): string {
  if (!val) return "";
  let rawDateStr = "";

  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(val.trim())) {
    if (val.includes("Z")) {
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        rawDateStr = formatISTFromDate(date);
      } else {
        rawDateStr = val.trim().replace("T", " ").slice(0, 19);
      }
    } else {
      rawDateStr = val.trim().replace("T", " ").slice(0, 19);
    }
  } else {
    const date = val instanceof Date ? val : new Date(val);
    if (isNaN(date.getTime())) {
      rawDateStr = String(val);
    } else {
      rawDateStr = formatISTFromDate(date);
    }
  }

  // Prepend single quote (') to force Google Sheets to display exact text string instead of auto-converting to a numeric serial date (e.g. 46287.54345)
  return `'${rawDateStr}`;
}

export async function addDownloadToSheet(data: {
  id: number;
  first_name: string;
  last_name: string;
  contact: string;
  email: string;
  company_name: string;
  country: string;
  state: string | null;
  downloaded_at: Date | string;
}) {
  const spreadsheetId = getSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:I",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        data.id,
        data.first_name,
        data.last_name,
        data.contact,
        data.email,
        data.company_name,
        data.country,
        data.state ?? "",
        formatISTDate(data.downloaded_at),
      ]],
    },
  });
}

export async function deleteDownloadFromSheet(id: number): Promise<boolean> {
  const spreadsheetId = getSpreadsheetId();

  // Fetch Column A to locate row with matching ID
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:A",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return false;
  }

  // Find 0-indexed row position
  const rowIndex = rows.findIndex((row) => row && String(row[0]).trim() === String(id).trim());

  if (rowIndex === -1) {
    return false;
  }

  const sheetId = await getSheetId(spreadsheetId, "Sheet1");

  // Delete matching row dimension
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });

  return true;
}

export async function clearSheetData(): Promise<void> {
  const spreadsheetId = getSpreadsheetId();

  // Clear data range A2:I while keeping header row 1
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "Sheet1!A2:I",
  });
}

export async function syncSheetsWithRDS(): Promise<void> {
  const spreadsheetId = getSpreadsheetId();

  // Fetch all current records from RDS (RDS is source of truth)
  const [rows] = await db.execute(
    "SELECT id, first_name, last_name, contact, email, company_name, country, state, downloaded_at FROM datasheet_downloads ORDER BY id ASC"
  );

  const rdsRecords = rows as Array<{
    id: number;
    first_name: string;
    last_name: string;
    contact: string;
    email: string;
    company_name: string;
    country: string;
    state: string | null;
    downloaded_at: Date | string;
  }>;

  // Clear existing sheet data (preserving header row 1)
  await clearSheetData();

  if (rdsRecords.length === 0) {
    return;
  }

  // Format records for Google Sheets
  const formattedValues = rdsRecords.map((rec) => [
    rec.id,
    rec.first_name,
    rec.last_name,
    rec.contact,
    rec.email,
    rec.company_name,
    rec.country,
    rec.state ?? "",
    formatISTDate(rec.downloaded_at),
  ]);

  // Bulk update data range starting at A2
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: formattedValues,
    },
  });
}

/**
 * Compares Google Sheets Column A IDs against RDS database IDs.
 * If any row was deleted or modified directly in MySQL, syncs Google Sheets to mirror RDS.
 */
export async function reconcileSheetsWithRDS(): Promise<void> {
  try {
    const spreadsheetId = getSpreadsheetId();

    // 1. Fetch current active IDs from RDS
    const [rdsRows] = await db.execute("SELECT id FROM datasheet_downloads ORDER BY id ASC");
    const rdsIds = (rdsRows as Array<{ id: number }>).map((r) => String(r.id));

    // 2. Fetch Google Sheets Column A IDs (A2:A)
    const sheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:A",
    });

    const sheetRows = sheetResponse.data.values || [];
    const sheetIds = sheetRows.map((r) => (r && r[0] !== undefined ? String(r[0]).trim() : "")).filter(Boolean);

    // 3. Compare RDS IDs vs Google Sheets IDs
    const isMatched =
      rdsIds.length === sheetIds.length &&
      rdsIds.every((id, idx) => id === sheetIds[idx]);

    // 4. Reconcile if mismatched
    if (!isMatched) {
      await syncSheetsWithRDS();
    }
  } catch (error) {
    console.error("Reconciliation check error:", error instanceof Error ? error.message : error);
  }
}

// Background auto-sync interval (runs every 10 seconds in server environment)
if (typeof window === "undefined") {
  const SYNC_INTERVAL_MS = 10000;
  const globalStore = global as unknown as Record<string, unknown>;
  if (!globalStore.__googleSheetsSyncTimer) {
    globalStore.__googleSheetsSyncTimer = setInterval(() => {
      reconcileSheetsWithRDS().catch(() => {});
    }, SYNC_INTERVAL_MS);
  }
}
