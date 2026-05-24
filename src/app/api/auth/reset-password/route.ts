import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { email, otp, newPassword } = parsed.data;

    // Rate limit: 5 attempts per email per 15 minutes
    if (!checkRateLimit(`reset:${email}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please wait 15 minutes and try again." },
        { status: 429 }
      );
    }

    // Verify user exists and uses credentials provider
    const { data: user } = await supabase
      .from("users")
      .select("user_id, password_hash, provider, is_verified")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid or expired OTP." }, { status: 400 });
    }

    if (user.provider === "google") {
      return NextResponse.json(
        { ok: false, error: "This account uses Google Sign-In and has no password to reset." },
        { status: 400 }
      );
    }

    // Validate OTP
    const nowUTC = new Date().toISOString();
    const { data: otpRecord } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .gt("expires_at", nowUTC)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRecord) {
      return NextResponse.json({ ok: false, error: "Invalid or expired OTP." }, { status: 400 });
    }

    // Hash new password and update
    const newHash = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: newHash })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json({ ok: false, error: "Failed to update password. Please try again." }, { status: 500 });
    }

    // Delete OTP so it cannot be reused
    await supabase.from("email_otps").delete().eq("email", email);

    return NextResponse.json({ ok: true, message: "Password reset successfully. You can now sign in." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
