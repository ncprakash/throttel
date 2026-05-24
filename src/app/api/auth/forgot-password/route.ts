import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { transporter } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { email } = parsed.data;

    // Rate limit: 3 requests per email per 15 minutes
    if (!checkRateLimit(`forgot:${email}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("user_id, first_name, email, is_verified, provider")
      .eq("email", email)
      .single();

    // Always return the same response to prevent email enumeration
    const genericOk = NextResponse.json({ ok: true, message: "If this email is registered, you will receive a reset OTP shortly." });

    if (!user) return genericOk;

    // Edge case: Google-only account has no password to reset
    if (user.provider === "google") {
      return NextResponse.json(
        { ok: false, error: "This account uses Google Sign-In. Please use the Google button to log in." },
        { status: 400 }
      );
    }

    // Edge case: unverified account — direct to verify email first
    if (!user.is_verified) {
      return NextResponse.json(
        { ok: false, error: "Your email is not verified yet. Please verify your email first." },
        { status: 400 }
      );
    }

    // Delete any existing OTP for this email and generate a fresh one
    await supabase.from("email_otps").delete().eq("email", email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await supabase.from("email_otps").insert({
      email,
      otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    await transporter.sendMail({
      from: `"Throttle" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - Throttle",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#000;">Password Reset Request</h2>
          <p>Hi ${user.first_name},</p>
          <p>We received a request to reset your password. Use the OTP below:</p>
          <div style="background:#f5f5f5;padding:20px;text-align:center;margin:20px 0;">
            <h1 style="color:#000;font-size:32px;letter-spacing:8px;margin:0;">${otp}</h1>
          </div>
          <p style="color:#666;font-size:14px;">This OTP expires in <strong>10 minutes</strong>.</p>
          <p style="color:#999;font-size:12px;margin-top:30px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return genericOk;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
