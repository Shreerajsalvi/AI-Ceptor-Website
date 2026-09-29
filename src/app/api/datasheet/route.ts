import { NextResponse } from "next/server";
import { Resend } from "resend";
import db from "@/lib/db";
import {
  addDownloadToSheet,
  deleteDownloadFromSheet,
  clearSheetData,
  syncSheetsWithRDS,
  reconcileSheetsWithRDS,
} from "@/lib/googleSheets";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const syncParam = searchParams.get("sync");

    if (syncParam === "true") {
      await syncSheetsWithRDS();
      return NextResponse.json(
        { success: true, message: "Google Sheets synchronized with RDS database" },
        { status: 200 }
      );
    }

    // Auto-reconcile Google Sheets with RDS to mirror any direct database deletions or updates
    await reconcileSheetsWithRDS();

    const [rows] = await db.execute(
      "SELECT id, first_name, last_name, contact, email, company_name, country, state, downloaded_at FROM datasheet_downloads ORDER BY id DESC LIMIT 100"
    );
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error instanceof Error ? error.message : "Query failed");
    return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { firstName, lastName, contact, email, company, country, state } = data;

    // Validate required fields
    if (!firstName || !lastName || !contact || !email || !company || !country) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Country/state logic: If country is India, store state; otherwise NULL
    const isIndia = country.trim().toLowerCase() === "india";
    const finalState = isIndia ? (state && state.trim() !== "" && state.trim() !== "-" ? state.trim() : null) : null;

    // Parameterized query to insert data into datasheet_downloads
    const query = `
      INSERT INTO datasheet_downloads (first_name, last_name, contact, email, company_name, country, state)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      firstName.trim(),
      lastName.trim(),
      contact.trim(),
      email.trim(),
      company.trim(),
      country.trim(),
      finalState,
    ];

    // Execute query
    const [result] = await db.execute(query, values);
    const insertedId = (result as { insertId?: number }).insertId || 0;

    // Generate IST timestamp (Asia/Kolkata) matching RDS database CURRENT_TIMESTAMP
    const istParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const istMap = new Map(istParts.map((p) => [p.type, p.value]));
    const downloadedAt = `${istMap.get("year")}-${istMap.get("month")}-${istMap.get("day")} ${istMap.get("hour")}:${istMap.get("minute")}:${istMap.get("second")}`;

    // Sync to Google Sheets (non-blocking for RDS record preservation)
    try {
      await addDownloadToSheet({
        id: insertedId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        contact: contact.trim(),
        email: email.trim(),
        company_name: company.trim(),
        country: country.trim(),
        state: finalState,
        downloaded_at: downloadedAt,
      });
    } catch (sheetsError) {
      console.error("Google Sheets append error:", sheetsError instanceof Error ? sheetsError.message : sheetsError);
    }

    // Send email notification via Resend
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "AI-CEPTOR Datasheet <onboarding@resend.dev>",
          to: ["info@aeromacdynamics.com"],
          replyTo: email,
          subject: `Datasheet Download: ${firstName} ${lastName} — ${company}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a2e; border-radius: 12px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; border-bottom: 1px solid #1e293b;">
                <h1 style="color: #f1f5f9; font-size: 20px; margin: 0 0 4px 0; font-weight: 700; letter-spacing: -0.02em;">Datasheet Download Request</h1>
                <p style="color: #64748b; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">AI-CEPTOR • Lead Captured</p>
              </div>
              <div style="padding: 32px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #1e293b; width: 120px;">Name</td>
                    <td style="padding: 12px 0; color: #f1f5f9; font-size: 15px; border-bottom: 1px solid #1e293b;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #1e293b;">Email</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1e293b;"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none; font-size: 15px;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #1e293b;">Contact</td>
                    <td style="padding: 12px 0; color: #f1f5f9; font-size: 15px; border-bottom: 1px solid #1e293b;">${contact}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #1e293b;">Company</td>
                    <td style="padding: 12px 0; color: #f1f5f9; font-size: 15px; border-bottom: 1px solid #1e293b;">${company}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #1e293b;">Country</td>
                    <td style="padding: 12px 0; color: #f1f5f9; font-size: 15px; border-bottom: 1px solid #1e293b;">${country}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">State</td>
                    <td style="padding: 12px 0; color: #f1f5f9; font-size: 15px;">${finalState || "N/A"}</td>
                  </tr>
                </table>
              </div>
              <div style="padding: 20px 32px; background: #0f172a; border-top: 1px solid #1e293b;">
                <p style="color: #475569; font-size: 11px; margin: 0; text-align: center;">AI-CEPTOR Datasheet Download • Lead saved to database • Aeromac Dynamics</p>
              </div>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Resend email notification error:", emailError instanceof Error ? emailError.message : "Email error");
    }

    return NextResponse.json(
      { success: true, message: "Form submitted successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database insertion error:", error instanceof Error ? error.message : "Insertion failed");
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const actionParam = searchParams.get("action");

    // Case 1: Clear/Truncate entire RDS table and clear Google Sheet data rows
    if (actionParam === "clear" || actionParam === "truncate") {
      await db.execute("TRUNCATE TABLE datasheet_downloads");
      try {
        await clearSheetData();
      } catch (sheetsError) {
        console.error("Google Sheets clear error:", sheetsError instanceof Error ? sheetsError.message : sheetsError);
      }
      return NextResponse.json(
        { success: true, message: "RDS table and Google Sheet data cleared successfully" },
        { status: 200 }
      );
    }

    // Case 2: Delete single record by ID
    if (idParam) {
      const id = Number(idParam);
      if (isNaN(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid ID parameter" },
          { status: 400 }
        );
      }

      const [result] = await db.execute("DELETE FROM datasheet_downloads WHERE id = ?", [id]);
      const affectedRows = (result as { affectedRows?: number }).affectedRows || 0;

      if (affectedRows === 0) {
        return NextResponse.json(
          { success: false, message: "Record not found in database" },
          { status: 404 }
        );
      }

      // Sync deletion to Google Sheets
      try {
        await deleteDownloadFromSheet(id);
      } catch (sheetsError) {
        console.error("Google Sheets deletion error:", sheetsError instanceof Error ? sheetsError.message : sheetsError);
      }

      return NextResponse.json(
        { success: true, message: `Record ${id} deleted successfully from database and Google Sheets` },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Missing id or action parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete handler error:", error instanceof Error ? error.message : "Deletion failed");
    return NextResponse.json(
      { success: false, message: "Failed to process deletion" },
      { status: 500 }
    );
  }
}


