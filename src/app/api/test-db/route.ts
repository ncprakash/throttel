import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"
import { transporter } from "@/lib/email"; 

export async function GET() {
  try {
    // Simple test: fetch 1 user (or empty if none)
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .limit(1);

    if (error) {
      return NextResponse.json(
        { success: false, message: "Supabase error", error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection working!",
      sampleUser: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
