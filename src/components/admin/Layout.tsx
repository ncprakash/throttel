// app/admin/page.tsx
"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";
import ProductsQuickList from "@/components/admin/ProductsQuickList";
import UsersList from "@/components/admin/UsersList";

export default function AdminPage() {
  // simple client-side routing via pathname is possible but here we render a two-column layout:
  // left: main content (Products form + list or Users list depending on path)
  // right: sidebar already exists (AdminSidebar)
  // For simplicity, show both product management and users side-by-side for admin console.
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <div className="space-y-6">
            {/* Products area (keep your product form/list) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductForm />
              </div>
              <aside>
                <ProductsQuickList onEdit={() => {}} />
              </aside>
            </div>

            {/* Users area */}
            <div>
              <UsersList />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <AdminSidebar />
        </div>
      </div>
    </div>
  );
}
