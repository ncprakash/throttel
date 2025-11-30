import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure Gmail SMTP (sender = your Gmail)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // smtp.gmail.com
  port: Number(process.env.SMTP_PORT),  // 465 if you followed earlier steps
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,        // e.g. Tforgedcustoms@gmail.com
    pass: process.env.SMTP_PASS,        // 16-char Gmail App Password
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // parses multipart/form-data [web:69]

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const orderId = String(formData.get("orderId") || "");
    const subject = String(formData.get("subject") || "Other");
    const message = String(formData.get("message") || "");
    const file = formData.get("attachment") as File | null;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const textBody = `
Name: ${name}
Email: ${email}
Order ID: ${orderId || "Not provided"}
Subject: ${subject}

Message:
${message}
    `.trim();

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color:#222;">
        <h2>New Support Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Order ID:</strong> ${orderId || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3 style="margin-top:16px;">Message</h3>
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `;

    const attachments =
      file && file.size > 0
        ? [
            {
              filename: file.name,
              content: Buffer.from(await file.arrayBuffer()),
            },
          ]
        : [];

    await transporter.sendMail({
      // SENDER (must match SMTP_USER for Gmail)
      from: `"Throtter Support" <${process.env.SMTP_USER}>`,
      // RECEIVER (can be same Gmail or a different support inbox)
      to: "Tforgedcustoms@gmail.com", // or support@tfcustoms.in if that forwards to Gmail
      replyTo: email,                  // replying goes to the customer
      subject: `Support: ${subject}${orderId ? ` (#${orderId})` : ""}`,
      text: textBody,
      html: htmlBody,
      attachments,
    }); // [web:41][web:70]

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Support email error:", error);
    return NextResponse.json(
      { error: "Failed to send support request" },
      { status: 500 }
    );
  }
}
