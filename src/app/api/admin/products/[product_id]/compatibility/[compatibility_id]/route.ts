// app/api/admin/products/[product_id]/compatibility/[compatibility_id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

interface RouteParams {
  params: Promise<{ product_id: string; compatibility_id: string }>;
}

export async function DELETE(_request: Request, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { product_id, compatibility_id } = await context.params;

    if (!compatibility_id) {
      return NextResponse.json({ error: "compatibility_id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("product_compatibility")
      .delete()
      .eq("compatibility_id", compatibility_id)
      .eq("product_id", product_id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete compatibility" }, { status: 500 });
    }

    return NextResponse.json({ message: "Compatibility deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
