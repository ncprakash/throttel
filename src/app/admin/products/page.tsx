// app/admin/products/page.tsx
"use client";

import ProductForm from "@/components/admin/ProductForm";
import ProductsQuickList from "@/components/admin/ProductsQuickList";
import { useState } from "react";

/**
 * Admin products page: left column - ProductForm, right column - ProductsQuickList
 * ProductForm will be remounted on edit via key prop.
 */

export default function AdminProductsPage() {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-white/60 mt-1">
            Create, update and manage catalog items.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductForm
            key={editingProduct?.product_id ?? "new"}
            product={editingProduct}
            onSaved={(p) => {
              setEditingProduct(null);
              // optionally toast or refresh logic
            }}
            onCancel={() => setEditingProduct(null)}
          />
        </div>

        <aside>
          <ProductsQuickList onEdit={(p) => setEditingProduct(p)} />
        </aside>
      </div>
    </div>
  );
}
