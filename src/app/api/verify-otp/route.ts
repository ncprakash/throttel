import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    const nowUTC = new Date().toISOString();

    // 1️⃣ Check OTP (not expired)
    const { data: otpRecord, error: otpError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .gt("expires_at", nowUTC)               // ⬅️ valid OTP only
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRecord || otpError) {
      return NextResponse.json(
        { ok: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // 2️⃣ Mark user as verified
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json(
        { ok: false, message: "Failed to verify user" },
        { status: 500 }
      );
    }

    // 3️⃣ Delete OTP after verification
    await supabase.from("email_otps").delete().eq("email", email);

    return NextResponse.json(
      { ok: true, message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}
