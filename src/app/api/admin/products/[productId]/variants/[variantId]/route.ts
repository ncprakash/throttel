// app/api/admin/products/[productId]/variants/[variantId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PATCH - Update variant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string; variantId: string } }
) {
  try {
    const { variantId } = params;
    const body = await request.json();
   

    const { data, error } = await supabase
      .from("product_variants")
      .update({
        variant_name: body.variant_name,
        color: body.color,
        size: body.size,
        sku: body.sku,
        additional_price: body.additional_price,
        stock_quantity: body.stock_quantity,
        is_active: body.is_active,
      })
      .eq("variant_id", variantId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ variant: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update variant" },
      { status: 500 }
    );
  }
}

// DELETE - Delete variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; variantId: string } }
) {
  try {
    const { variantId } = params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("variant_id", variantId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Variant deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete variant" },
      { status: 500 }
    );
  }
}
