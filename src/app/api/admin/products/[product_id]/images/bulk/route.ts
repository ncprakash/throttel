import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ product_id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { product_id } = await params;

    if (!product_id || product_id === "undefined" || product_id === "null") {
      return NextResponse.json({ error: "Invalid product_id" }, { status: 400 });
    }

    const formData = await request.formData();
    const images = formData.getAll("images") as File[];

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    if (images.length > 8) {
      return NextResponse.json({ error: "Maximum 8 images allowed" }, { status: 400 });
    }

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

    const imageRecords = uploadedImages.map((img) => ({
      product_id,
      ...img,
    }));

    const { data, error } = await supabase
      .from("product_images")
      .insert(imageRecords)
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save images to database", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: data,
      message: `Successfully uploaded ${images.length} images`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload images";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
