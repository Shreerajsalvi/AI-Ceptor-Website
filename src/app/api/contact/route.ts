import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY environment variable is missing.");
      return NextResponse.json(
        { error: "Email service is not configured. Missing RESEND_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { name, email, message, company, phone } = body;

    // Input Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required (Name, Email, Message)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || "info@aeromacdynamics.com";
    const senderEmail = process.env.CONTACT_SENDER_EMAIL || "AI-CEPTOR Contact Form <onboarding@resend.dev>";

    // Optional DB storage into contact_inquiries table if DB available
    try {
      const dbQuery = `
        CREATE TABLE IF NOT EXISTS contact_inquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          company VARCHAR(255),
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await db.execute(dbQuery);

      const insertQuery = `
        INSERT INTO contact_inquiries (name, email, phone, company, message)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.execute(insertQuery, [
        name.trim(),
        email.trim(),
        phone?.trim() || null,
        company?.trim() || null,
        message.trim(),
      ]);
    } catch (dbError) {
      console.warn("Database save skipped or failed (proceeding with email dispatch):", dbError instanceof Error ? dbError.message : "DB error");
    }

    // Send email via Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      replyTo: email.trim(),
      subject: `[AI-CEPTOR Inquiry] New Contact Message from ${name.trim()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Inquiry</title>
        </head>
        <body style="margin:0; padding:0; background-color:#030712; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#f3f4f6;">
          <div style="max-width:640px; margin:30px auto; background-color:#0b0f19; border:1px solid #1f293d; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0b1528 0%, #172554 100%); padding:28px 32px; border-bottom:1px solid #1e293b;">
              <div style="display:inline-block; font-size:11px; font-weight:700; letter-spacing:0.15em; color:#38bdf8; text-transform:uppercase; margin-bottom:6px;">
                AI-CEPTOR • Aeromac Dynamics
              </div>
              <h1 style="color:#ffffff; font-size:22px; font-weight:700; margin:0; letter-spacing:-0.02em;">
                New Contact Form Inquiry
              </h1>
            </div>

            <!-- Content Area -->
            <div style="padding:32px;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 0; color:#94a3b8; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid #1e293b; width:130px;">Sender Name</td>
                  <td style="padding:14px 0; color:#f8fafc; font-size:15px; font-weight:500; border-bottom:1px solid #1e293b;">${name.trim()}</td>
                </tr>
                <tr>
                  <td style="padding:14px 0; color:#94a3b8; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid #1e293b;">Email Address</td>
                  <td style="padding:14px 0; border-bottom:1px solid #1e293b;">
                    <a href="mailto:${email.trim()}" style="color:#38bdf8; text-decoration:none; font-size:15px; font-weight:500;">${email.trim()}</a>
                  </td>
                </tr>
                ${
                  phone?.trim()
                    ? `<tr>
                        <td style="padding:14px 0; color:#94a3b8; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid #1e293b;">Phone Number</td>
                        <td style="padding:14px 0; color:#f8fafc; font-size:15px; border-bottom:1px solid #1e293b;">${phone.trim()}</td>
                       </tr>`
                    : ""
                }
                ${
                  company?.trim()
                    ? `<tr>
                        <td style="padding:14px 0; color:#94a3b8; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid #1e293b;">Company / Org</td>
                        <td style="padding:14px 0; color:#f8fafc; font-size:15px; border-bottom:1px solid #1e293b;">${company.trim()}</td>
                       </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:16px 0 6px 0; color:#94a3b8; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em;" colspan="2">Inquiry Message</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:16px; background-color:#030712; border:1px solid #1e293b; border-radius:8px; color:#e2e8f0; font-size:14px; line-height:1.6; white-space:pre-wrap;">${message.trim()}</td>
                </tr>
              </table>
            </div>

            <!-- Footer -->
            <div style="padding:18px 32px; background-color:#030712; border-top:1px solid #1e293b; text-align:center;">
              <p style="color:#64748b; font-size:11px; margin:0; font-weight:500;">
                Sent via AI-CEPTOR Contact Form • Aeromac Dynamics Pvt. Ltd.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      return NextResponse.json(
        { error: resendError.message || "Failed to send email inquiry." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Inquiry sent successfully.", data: resendData },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process inquiry.";
    console.error("Contact API route exception:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

