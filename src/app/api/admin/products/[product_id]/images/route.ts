// src\app\api\admin\products\[product_id]\images\route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabase } from "@/lib/supabase";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface RouteParams {
  params: Promise<{
    product_id: string;
  }>;
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { product_id } = await context.params;
    const body = await request.json();
    const { image_ids } = body;

    if (!image_ids || !Array.isArray(image_ids) || image_ids.length === 0) {
      return NextResponse.json(
        { error: "No image IDs provided" },
        { status: 400 }
      );
    }

    // Get images from database to get their URLs for Cloudinary deletion
    const { data: imagesToDelete, error: fetchError } = await supabase
      .from("product_images")
      .select("image_id, image_url")
      .in("image_id", image_ids)
      .eq("product_id", product_id);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch images" },
        { status: 500 }
      );
    }

    // Delete from Cloudinary
    for (const img of imagesToDelete || []) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = img.image_url.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Failed to delete from Cloudinary:", err);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .in("image_id", image_ids)
      .eq("product_id", product_id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete images" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Images deleted successfully", deleted_count: image_ids.length },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE /api/admin/products/[product_id]/images error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
