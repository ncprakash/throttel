// app/admin/products/page.tsx
"use client";

import ProductForm from "@/components/admin/ProductForm";
import ProductsQuickList from "@/components/admin/ProductsQuickList";
import { useState } from "react";

export default function AdminProductsPage() {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-white/60 mt-1">
            Create, update and manage catalog items.
          </p>
        </div>
      </div>

      {/* Product Form (full width) */}
      <div className="w-full">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <ProductForm
            key={editingProduct?.product_id ?? "new"}
            product={editingProduct}
            onSaved={() => setEditingProduct(null)}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      </div>

      {/* Products List BELOW form */}
      <div>
        <h2 className="text-lg font-semibold mb-3">All Products</h2>

        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <ProductsQuickList onEdit={(p) => setEditingProduct(p)} />
        </div>
      </div>
    </div>
  );
}
