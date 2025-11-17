// app/api/admin/categories/[category_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  try {
    const { category_id } = await params;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("category_id", category_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  try {
    const { category_id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("categories")
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description,
        parent_id: body.parent_id,
        is_active: body.is_active,
      })
      .eq("category_id", category_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  try {
    const { category_id } = await params;

    console.log("=== Deleting Category ===");
    console.log("Category ID:", category_id);

    // Check if category exists
    const { data: existing, error: checkError } = await supabase
      .from("categories")
      .select("category_id, name")
      .eq("category_id", category_id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has child categories
    const { data: children, error: childError } = await supabase
      .from("categories")
      .select("category_id")
      .eq("parent_id", category_id);

    if (childError) {
      return NextResponse.json(
        { error: "Failed to check child categories" },
        { status: 500 }
      );
    }

    if (children && children.length > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete category with subcategories",
          details: `This category has ${children.length} subcategory(ies). Please delete or move them first.`
        },
        { status: 400 }
      );
    }

    // Check if category has products
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("product_id")
      .eq("category_id", category_id);

    if (productError) {
      return NextResponse.json(
        { error: "Failed to check products" },
        { status: 500 }
      );
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete category with products",
          details: `This category has ${products.length} product(s). Please delete or move them first.`
        },
        { status: 400 }
      );
    }

    // Delete the category
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("category_id", category_id);

    if (deleteError) {
      console.error("❌ Delete failed:", deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    console.log("✅ Category deleted:", existing.name);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
