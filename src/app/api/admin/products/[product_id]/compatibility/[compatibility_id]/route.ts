// app/api/admin/products/[product_id]/compatibility/[compatibility_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{
    product_id: string;
    compatibility_id: string;
  }>;
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { product_id, compatibility_id } = await context.params;

    if (!compatibility_id) {
      return NextResponse.json(
        { error: "compatibility_id is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("product_compatibility")
      .delete()
      .eq("compatibility_id", compatibility_id)
      .eq("product_id", product_id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete compatibility" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Compatibility deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
