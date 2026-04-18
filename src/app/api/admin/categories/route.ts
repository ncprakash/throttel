// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { categorySchema } from "@/lib/schemas";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { name, slug, description, is_active } = parsed.data;

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        description: description || null,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
