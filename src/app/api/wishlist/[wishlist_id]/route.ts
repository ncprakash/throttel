import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// DELETE - Remove single item from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ wishlist_id: string }> }
) {
  try {
    const { wishlist_id } = await params;

    console.log("=== Removing from Wishlist ===");
    console.log("Wishlist ID:", wishlist_id);

    if (!wishlist_id) {
      return NextResponse.json(
        { error: "wishlist_id is required" },
        { status: 400 }
      );
    }

    // Delete the wishlist item
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("wishlist_id", wishlist_id);

    if (error) {
      console.error("❌ Failed to remove from wishlist:", error);
      return NextResponse.json(
        { error: "Failed to remove from wishlist", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Removed from wishlist");

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist successfully",
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
