import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const createTransport = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), // 465
    secure: true,                        // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const transporter = createTransport();  // ← Uses corrected function
    
    // Rest of the code unchanged...
    await transporter.sendMail({
      from: `"Throttle Club" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to The Throttle Club! 🏍️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000; font-size: 28px; font-weight: bold;">Welcome to The Throttle Club!</h1>
          <p>Hello Rider 👋,</p>
          <p>You're now part of the exclusive Throttle Club! Get ready for:</p>
          <ul style="color: #333; padding-left: 20px;">
            <li>🔥 New release drops</li>
            <li>⚡ Performance tuning tips</li>
            <li>🏆 Pro rider insights</li>
            <li>💰 Members-only offers</li>
          </ul>
          <p style="color: #666;">Rev up your inbox – no spam, just speed!</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #888; font-size: 12px;">
            Throttle Forged Customs | <a href="/privacy">Privacy Policy</a> | Unsubscribe anytime
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
