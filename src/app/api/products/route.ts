// app/api/products/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET() {
  try {
    console.log("📦 Fetching all products...");

    // Fetch all active products with images
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(`
        product_id,
        name,
        slug,
        short_description,
        regular_price,
        sale_price,
        stock_quantity,
        is_active,
        is_featured,
        product_images (
          image_url,
          alt_text,
          is_primary
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (productsError) {
      console.error("❌ Products error:", productsError);
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    console.log("✅ Products fetched:", productsData?.length || 0);

    // Get compatibility info for each product
    const productIds = productsData?.map((p: any) => p.product_id) || [];
    
    const { data: compatibilityData, error: compatError } = await supabase
      .from("product_compatibility")
      .select("*")
      .in("product_id", productIds);

    if (compatError) {
      console.error("⚠️ Compatibility error:", compatError);
    }

    console.log("✅ Compatibility fetched:", compatibilityData?.length || 0);

    // Format response
    const formattedProducts = productsData?.map((product: any) => {
      const primaryImage = product.product_images?.find((img: any) => img.is_primary) 
        || product.product_images?.[0];
      
      // Get all compatible bikes for this product
      const compatibleBikes = compatibilityData
        ?.filter((c: any) => c.product_id === product.product_id)
        .map((c: any) => c.bike_model) || [];

      return {
        id: product.product_id,
        name: product.name,
        slug: product.slug,
        description: product.short_description || "",
        price: product.sale_price || product.regular_price,
        originalPrice: product.sale_price ? product.regular_price : null,
        stock: product.stock_quantity,
        image: primaryImage?.image_url || "/placeholder.jpg",
        compatibility: compatibleBikes.length > 0,
        compatibleWith: compatibleBikes,
        isFeatured: product.is_featured,
      };
    });

    return NextResponse.json({ 
      success: true,
      products: formattedProducts || [], 
      count: formattedProducts?.length || 0 
    });

  } catch (error: any) {
    console.error("💥 Error fetching products:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
