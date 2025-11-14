import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { transporter } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, last_name, first_name, password } = body;

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { ok: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check email exists
    const { data: existingEmail } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { ok: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    // Check phone exists (if phone provided)
    if (phone) {
      const { data: existingPhone } = await supabase
        .from("users")
        .select("phone")
        .eq("phone", phone)
        .single();

      if (existingPhone) {
        return NextResponse.json(
          { ok: false, error: "Phone number already exists" },
          { status: 409 }
        );
      }
    }

    // Hash password with bcrypt (10 rounds is secure and performant)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (unverified)
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        phone: phone || null,
        last_name,
        first_name,
        password_hash: hashedPassword,
        is_verified: false,
        role: "customer",
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json(
        { ok: false, error: userError.message },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP with expiration (10 minutes)
  const { error: otpError } = await supabase
  .from("email_otps")
  .insert({
    email,
    otp,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  })
  .select();


    if (otpError) {
      console.error("OTP creation error:", otpError);
      // Continue anyway - user is created
    }

    // Send OTP Email
    try {
      await transporter.sendMail({
        from: `"Throttle" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - Throttle",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">Email Verification</h2>
            <p>Hi ${first_name},</p>
            <p>Thank you for signing up! Please use the following OTP to verify your email:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #000; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // User is created, but email failed
      return NextResponse.json(
        {
          ok: true,
          message: "User created but email failed to send. Please contact support.",
          user_id: newUser.user_id,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "User created. OTP sent to email.",
        user_id: newUser.user_id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Sign-up error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
