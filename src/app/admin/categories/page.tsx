// app/admin/categories/page.tsx
"use client";

import CategoriesManager from "@/components/admin/CategoriesManager";

export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-white/60 mt-1">
            Manage product categories used by ProductForm
          </p>
        </div>
      </div>

      <div className="mt-6">
        <CategoriesManager />
      </div>
    </div>
  );
}
