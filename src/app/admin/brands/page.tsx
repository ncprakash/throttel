// app/admin/brands/page.tsx
"use client";

import React from "react";
import BrandsList from "@/components/admin/BrandsList";

export default function AdminBrandsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brands</h1>
          <p className="text-sm text-white/60 mt-1">
            Overview of brands and related products
          </p>
        </div>
      </div>

      <div className="mt-6">
        <BrandsList />
      </div>
    </div>
  );
}
