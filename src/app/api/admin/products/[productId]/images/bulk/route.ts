// app/api/admin/products/[productId]/images/bulk/route.ts
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
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const formData = await request.formData();
    const images = formData.getAll("images") as File[];

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
      product_id: productId,
      ...img,
    }));

    const { data, error } = await supabase
      .from("product_images")
      .insert(imageRecords)
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to save images to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: data,
      message: `Successfully uploaded ${images.length} images`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload images" },
      { status: 500 }
    );
  }
}
