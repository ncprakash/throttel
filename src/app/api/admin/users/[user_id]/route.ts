// app/api/admin/users/[user_id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { user_id } = await params;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
