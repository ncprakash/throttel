import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyOtpSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: parsed.error.issues[0].message }, { status: 400 });
    }
    const { email, otp } = parsed.data;

    // 5 attempts per email per 15 minutes
    if (!checkRateLimit(`otp:${email}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { ok: false, message: "Too many attempts. Please wait 15 minutes and try again." },
        { status: 429 }
      );
    }

    const nowUTC = new Date().toISOString();

    const { data: otpRecord, error: otpError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .gt("expires_at", nowUTC)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRecord || otpError) {
      return NextResponse.json(
        { ok: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

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

    await supabase.from("email_otps").delete().eq("email", email);

    return NextResponse.json({ ok: true, message: "OTP verified successfully" }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
