import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    await db.execute("SELECT 1");
    return NextResponse.json(
      {
        success: true,
        message: "AWS MySQL connected successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection test error:", error instanceof Error ? error.message : "Connection failed");
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
