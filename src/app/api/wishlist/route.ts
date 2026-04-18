import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id } = body;

    if (!user_id || !product_id) {
      return NextResponse.json(
        { error: "user_id and product_id are required" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Product already in wishlist", wishlist_item: existing },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("wishlist")
      .insert({ user_id, product_id })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to add to wishlist", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, wishlist_item: data, message: "Added to wishlist successfully" },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add to wishlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id")?.trim();

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select(`
        *,
        products (
          product_id,
          slug,
          name,
          description,
          regular_price,
          sale_price,
          stock_quantity,
          product_images (
            image_url,
            alt_text,
            is_primary
          )
        )
      `)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch wishlist", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, wishlist: data || [], count: data?.length || 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch wishlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("wishlist").delete().eq("user_id", user_id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to clear wishlist", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Wishlist cleared successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to clear wishlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
