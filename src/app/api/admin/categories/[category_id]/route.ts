import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category_id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { category_id } = await params;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("category_id", category_id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Category not found" },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({ category: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { category_id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("categories")
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description,
        parent_id: body.parent_id || null,
        is_active: body.is_active,
      })
      .eq("category_id", category_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ category_id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { category_id } = await params;

    const { data: category } = await supabase
      .from("categories")
      .select("category_id, name")
      .eq("category_id", category_id)
      .single();

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const { data: products } = await supabase
      .from("products")
      .select("product_id")
      .eq("category_id", category_id);

    let deletedProductsCount = 0;

    if (products && products.length > 0) {
      const { error: productsDeleteError } = await supabase
        .from("products")
        .delete()
        .eq("category_id", category_id);

      if (productsDeleteError) {
        await supabase
          .from("products")
          .update({ category_id: null })
          .eq("category_id", category_id);
      } else {
        deletedProductsCount = products.length;
      }
    }

    const { error: categoryDeleteError } = await supabase
      .from("categories")
      .delete()
      .eq("category_id", category_id);

    if (categoryDeleteError) {
      return NextResponse.json({ error: categoryDeleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" deleted (${deletedProductsCount} products ${deletedProductsCount > 0 ? "deleted" : "unassigned"})`,
      deleted_products: deletedProductsCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Cascade delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
