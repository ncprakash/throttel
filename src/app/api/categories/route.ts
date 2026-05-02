import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("category_id, name, slug")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { categories: data || [] },
      { headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=7200" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
