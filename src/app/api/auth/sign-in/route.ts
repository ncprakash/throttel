import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { transporter } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, last_name, full_name, hashedPassword } = body;

    // Check email exists
    const { data: existingEmail } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Check phone exists
    const { data: existingPhone } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone)
      .single();

    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 409 }
      );
    }

    // Insert user (unverified)
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        phone,
        last_name,
        first_name: full_name,
        password_hash: hashedPassword,
        is_verified: false,
        role: "customer",
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP
    await supabase.from("email_otps").insert({
      user_id: newUser.user_id,
      email,
      otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send OTP Email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:#ff6600;">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    return NextResponse.json(
      {
        message: "User created. OTP sent to email.",
        user_id: newUser.user_id,
      },
      { status: 201 }
    );

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
