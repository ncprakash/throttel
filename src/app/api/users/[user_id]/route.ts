import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const { user_id } = await params;

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const body = await request.json();
  const { first_name, last_name, phone } = body;

  const { data, error } = await supabase
    .from("users")
    .update({ first_name, last_name, phone })
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data }, { status: 200 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const { user_id } = await params;

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("user_id, email, first_name, last_name, phone, created_at, is_verified, role")
    .eq("user_id", user_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: data }, { status: 200 });
}
