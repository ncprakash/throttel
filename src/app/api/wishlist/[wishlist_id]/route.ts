import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ wishlist_id: string }> }
) {
  try {
    const { wishlist_id } = await params;

    if (!wishlist_id) {
      return NextResponse.json({ error: "wishlist_id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("wishlist_id", wishlist_id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to remove from wishlist", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Removed from wishlist successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove from wishlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
