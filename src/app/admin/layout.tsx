// app/admin/layout.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { ReactNode } from "react";
import { auth } from "@/auth"; // your NextAuth server helper
import { redirect } from "next/navigation";

export const metadata = {
  title: "Throttel Admin",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // Redirect if no session or user is not admin
  if (!session || (session.user as any).role !== "admin") {
    redirect("/auth"); // or /unauthorized page
  }

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
