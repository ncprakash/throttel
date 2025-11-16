// app/api/products/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";



export async function GET(request: NextRequest) {
  const bikeModel = request.nextUrl.searchParams.get("bikeModel");

  if (!bikeModel) {
    return NextResponse.json({ error: "Bike model is required" }, { status: 400 });
  }

  // CLEAN THE SEARCH STRING - Remove whitespace and newlines
  const cleanedBikeModel = bikeModel.trim().replace(/\s+/g, " ");

  console.log("🔍 Original search:", JSON.stringify(bikeModel));
  console.log("✨ Cleaned search:", JSON.stringify(cleanedBikeModel));

  try {
    // Get compatibility data with cleaned search
    const { data: compatData, error: compatError } = await supabase
      .from("product_compatibility")
      .select("*")
      .ilike("bike_model", `%${cleanedBikeModel}%`);

    console.log("📊 Compatibility found:", compatData?.length || 0);

    if (compatError) {
      console.error("❌ Compatibility error:", compatError);
      return NextResponse.json({ error: compatError.message }, { status: 500 });
    }

    if (!compatData || compatData.length === 0) {
      return NextResponse.json({ 
        success: true,
        products: [], 
        count: 0,
        message: `No products found for "${cleanedBikeModel}"`,
        debug: {
          originalSearch: bikeModel,
          cleanedSearch: cleanedBikeModel
        }
      });
    }

    // Get product IDs
    const productIds = compatData.map((c: any) => c.product_id);
    console.log("🆔 Product IDs:", productIds);

    // Fetch products with images
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
        product_images (
          image_url,
          alt_text,
          is_primary
        )
      `)
      .in("product_id", productIds)
      .eq("is_active", true);

    console.log("📦 Products found:", productsData?.length || 0);

    if (productsError) {
      console.error("❌ Products error:", productsError);
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    // Format response
    const formattedProducts = productsData?.map((product: any) => {
      const compatibility = compatData.find((c: any) => c.product_id === product.product_id);
      const primaryImage = product.product_images?.find((img: any) => img.is_primary) 
        || product.product_images?.[0];

      return {
        id: product.product_id,
        name: product.name,
        slug: product.slug,
        description: product.short_description || "",
        price: product.sale_price || product.regular_price,
        originalPrice: product.sale_price ? product.regular_price : null,
        stock: product.stock_quantity,
        image: primaryImage?.image_url || "/placeholder.jpg",
        compatibility: true,
        compatibleWith: [compatibility?.bike_model],
        bikeInfo: {
          model: compatibility?.bike_model,
          brand: compatibility?.bike_brand,
          yearRange: `${compatibility?.year_from}-${compatibility?.year_to}`,
          notes: compatibility?.notes || "",
        },
      };
    });

    console.log("✅ Final products:", formattedProducts?.length || 0);

    return NextResponse.json({ 
      success: true,
      products: formattedProducts || [], 
      count: formattedProducts?.length || 0,
      searchedModel: cleanedBikeModel
    });

  } catch (error: any) {
    console.error("💥 Error:", error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
