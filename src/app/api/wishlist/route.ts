import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("=== Adding to Wishlist ===");
    console.log("Request body:", body);

    const { user_id, product_id } = body;

    // Validate required fields
    if (!user_id || !product_id) {
      return NextResponse.json(
        { error: "user_id and product_id are required" },
        { status: 400 }
      );
    }

    // Check if item already exists in wishlist
    const { data: existing, error: checkError } = await supabase
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

    // Add to wishlist
    const { data, error } = await supabase
      .from("wishlist")
      .insert({
        user_id: user_id,
        product_id: product_id,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Failed to add to wishlist:", error);
      return NextResponse.json(
        { error: "Failed to add to wishlist", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Added to wishlist:", data);

    return NextResponse.json(
      {
        success: true,
        wishlist_item: data,
        message: "Added to wishlist successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

// GET - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id")?.trim()

    console.log("=== Fetching Wishlist ===");
    console.log("User ID:", user_id);

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    // Fetch wishlist with product details
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
      console.error("❌ Failed to fetch wishlist:", error);
      return NextResponse.json(
        { error: "Failed to fetch wishlist", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Wishlist items:", data?.length);

    return NextResponse.json({
      success: true,
      wishlist: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove all items (optional - clear wishlist)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    console.log("=== Clearing Wishlist ===");
    console.log("User ID:", user_id);

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user_id);

    if (error) {
      console.error("❌ Failed to clear wishlist:", error);
      return NextResponse.json(
        { error: "Failed to clear wishlist", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Wishlist cleared");

    return NextResponse.json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to clear wishlist" },
      { status: 500 }
    );
  }
}
