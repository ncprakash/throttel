import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // 1️⃣ Find OTP record for this user
    const { data: otpRecord, error: otpError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if OTP is expired
    const now = new Date();
    const expiry = new Date(otpRecord.expires_at);

    if (now > expiry) {
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    // 3️⃣ OTP is correct → mark user as verified
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: "Failed to verify user" },
        { status: 500 }
      );
    }

    // 4️⃣ Delete OTP after successful verification
    await supabase
      .from("email_otps")
      .delete()
      .eq("email", email);

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
