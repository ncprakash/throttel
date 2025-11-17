// app/api/admin/products/[product_id]/images/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabase } from "@/lib/supabase";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }  // ✅ Changed to Promise
) {
  try {
    // ✅ CRITICAL: Await params before accessing
    const { product_id } = await params;

    // 🔍 DEBUG: Add logging
    console.log("=== Image Upload API ===");
    console.log("Received product_id:", product_id);
    console.log("Type:", typeof product_id);
    
    // Validate product_id
    if (!product_id || product_id === "undefined" || product_id === "null") {
      console.error("❌ Invalid product_id:", product_id);
      return NextResponse.json(
        { error: "Invalid product_id" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const images = formData.getAll("images") as File[];

    console.log("Number of images:", images.length);
    console.log("========================");

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    if (images.length > 8) {
      return NextResponse.json(
        { error: "Maximum 8 images allowed" },
        { status: 400 }
      );
    }

    // Upload all images to Cloudinary in parallel
    const uploadPromises = images.map(async (image, index) => {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: "products",
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      });

      return {
        image_url: uploadResult.secure_url,
        alt_text: image.name,
        display_order: index,
        is_primary: index === 0,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Save all to database
    const imageRecords = uploadedImages.map((img) => ({
      product_id: product_id,  // ✅ Now this will have the correct value
      ...img,
    }));

    // 🔍 DEBUG: Log what we're inserting
    console.log("=== Inserting to DB ===");
    console.log("First record:", JSON.stringify(imageRecords[0], null, 2));
    
    const { data, error } = await supabase
      .from("product_images")
      .insert(imageRecords)
      .select();

    if (error) {
      console.error("❌ Database error:", error);
      return NextResponse.json(
        { error: "Failed to save images to database", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Images saved to DB:", data?.length);
    console.log("=======================");

    return NextResponse.json({
      success: true,
      images: data,
      message: `Successfully uploaded ${images.length} images`,
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload images" },
      { status: 500 }
    );
  }
}
