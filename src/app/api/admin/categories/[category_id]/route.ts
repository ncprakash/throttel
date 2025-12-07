import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  try {
    const { category_id } = await params; // ✅ Must await

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
    const { category_id } = await params; // ✅ Must await
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
    console.log("=== CASCADE DELETE ===");
    console.log("Category ID:", category_id);

    // 1. Check category exists
    const { data: category } = await supabase
      .from("categories")
      .select("category_id, name")
      .eq("category_id", category_id)
      .single();

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // 2. Find products (read-only, usually allowed)
    const { data: products } = await supabase
      .from("products")
      .select("product_id")
      .eq("category_id", category_id);

    let deletedProductsCount = 0;

    // 3. Delete products FIRST (if any exist)
    if (products && products.length > 0) {
      console.log(`Found ${products.length} products to delete`);
      
      const { error: productsDeleteError } = await supabase
        .from("products")
        .delete()
        .eq("category_id", category_id);

      if (productsDeleteError) {
        console.error("Products delete error:", productsDeleteError);
        // Don't fail - try unassigning instead
        console.log("Trying to unassign products instead...");
        
        const { error: unassignError } = await supabase
          .from("products")
          .update({ category_id: null })
          .eq("category_id", category_id);
          
        if (unassignError) {
          console.error("Unassign failed too:", unassignError);
        } else {
          console.log("✅ Unassigned products");
        }
        deletedProductsCount = 0; // Unassigned, not deleted
      } else {
        deletedProductsCount = products.length;
        console.log(`✅ Deleted ${deletedProductsCount} products`);
      }
    }

    // 4. Delete category
    const { error: categoryDeleteError } = await supabase
      .from("categories")
      .delete()
      .eq("category_id", category_id);

    if (categoryDeleteError) {
      console.error("Category delete failed:", categoryDeleteError);
      return NextResponse.json(
        { error: categoryDeleteError.message },
        { status: 500 }
      );
    }

    console.log("✅ CASCADE COMPLETE:", category.name);
    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" deleted (${deletedProductsCount} products ${deletedProductsCount > 0 ? 'deleted' : 'unassigned'})`,
      deleted_products: deletedProductsCount
    });

  } catch (error: any) {
    console.error("❌ Cascade error:", error);
    return NextResponse.json(
      { error: error.message || "Cascade delete failed" },
      { status: 500 }
    );
  }
}


