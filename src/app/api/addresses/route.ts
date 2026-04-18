import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user_id)
      .order("is_default", { ascending: false });

    if (error) {
      // Table may not exist yet — return empty array gracefully
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch addresses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
