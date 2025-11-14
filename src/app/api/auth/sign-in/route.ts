import { NextResponse } from "next/server";

import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone } = body;

    // 1️⃣ Check if email exists
    const { data: existingEmail, error: emailError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // 2️⃣ Check if phone exists
    const { data: existingPhone, error: phoneError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 409 }
      );
    }

    // 3️⃣ If both email & phone are available → Tell frontend to proceed with OTP
    return NextResponse.json(
      { message: "OK to proceed with OTP verification" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
