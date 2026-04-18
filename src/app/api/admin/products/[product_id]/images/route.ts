// src/app/api/admin/products/[product_id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface RouteParams {
  params: Promise<{ product_id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { product_id } = await context.params;
    const body = await request.json();
    const { image_ids } = body;

    if (!image_ids || !Array.isArray(image_ids) || image_ids.length === 0) {
      return NextResponse.json({ error: "No image IDs provided" }, { status: 400 });
    }

    const { data: imagesToDelete, error: fetchError } = await supabase
      .from("product_images")
      .select("image_id, image_url")
      .in("image_id", image_ids)
      .eq("product_id", product_id);

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }

    for (const img of imagesToDelete || []) {
      try {
        const urlParts = (img.image_url as string).split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch {
        // Continue with database deletion even if Cloudinary fails
      }
    }

    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .in("image_id", image_ids)
      .eq("product_id", product_id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete images" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Images deleted successfully", deleted_count: image_ids.length },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
