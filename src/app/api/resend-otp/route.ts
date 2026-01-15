import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { transporter } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // 🔍 Check user
    const { data: user } = await supabase
      .from("users")
      .select("first_name, is_verified")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.is_verified) {
      return NextResponse.json(
        { ok: false, error: "Email already verified" },
        { status: 400 }
      );
    }

    // 🔢 Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ⏱️ Expiry: 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 🧹 Optional: delete old OTPs for this email
    await supabase.from("email_otps").delete().eq("email", email);

    // 💾 Save new OTP
    const { error: otpError } = await supabase.from("email_otps").insert({
      email,
      otp,
      expires_at: expiresAt,
    });

    if (otpError) {
      return NextResponse.json(
        { ok: false, error: "Failed to generate OTP" },
        { status: 500 }
      );
    }

    // 📧 Send OTP email
    await transporter.sendMail({
      from: `"Throttle" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code - Throttle",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Email Verification</h2>
          <p>Hi ${user.first_name},</p>
          <p>Your new OTP is:</p>
          <div style="background:#f5f5f5;padding:20px;text-align:center;margin:20px 0;">
            <h1 style="letter-spacing:8px;">${otp}</h1>
          </div>
          <p style="font-size:14px;color:#666;">
            This code expires in 10 minutes.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { ok: true, message: "OTP resent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Resend OTP error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
