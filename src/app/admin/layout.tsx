// app/admin/layout.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { ReactNode } from "react";

export const metadata = {
  title: "Throttel Admin",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            {/* main content area */}
            <div className="space-y-6">{children}</div>
          </div>

          <div className="lg:col-span-3">
            {/* AdminSidebar is a client component (interactive) */}
            <AdminSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
