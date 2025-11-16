// components/admin/AdminSidebar.tsx
"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
};

export default function AdminSidebar({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const items: NavItem[] = [
    {
      id: "products",
      label: "Products",
      // make products route explicit so it doesn't match /admin/brands etc
      path: "/admin/products",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
      ),
    },
    {
      id: "brands",
      label: "Brands",
      path: "/admin/brands",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2l3 6 6 .5-4.5 3 1.5 6L12 15l-6 3 1.5-6L3 8.5 9 8z"
          />
        </svg>
      ),
    },
    {
      id: "users",
      label: "Users",
      path: "/admin/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM6 11c1.657 0 3-1.343 3-3S7.657 5 6 5 3 6.343 3 8s1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1h14v-1c0-2.21-1.79-4-4-4H6zM16 13c-1.657 0-3 1.343-3 3v1h8v-1c0-1.657-1.343-3-3-3h-2z"
          />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders",
      path: "/admin/orders",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h18v4H3zM3 11h18v10H3z"
          />
        </svg>
      ),
    },
    {
      id: "categories",
      label: "Categories",
      path: "/admin/categories",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      ),
    },

    {
      id: "settings",
      label: "Settings",
      path: "/admin/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3"
          />
        </svg>
      ),
    },
  ];

  // Robust active-check:
  // - exact match OR
  // - pathname starts with item.path + '/' (so /admin/products/123 matches /admin/products)
  // This avoids the /admin prefix problem.
  const isActive = (path: string) => {
    if (pathname === path || pathname === path + "/") return true;
    return pathname.startsWith(path.endsWith("/") ? path : path + "/");
  };

  return (
    <aside
      className={`w-72 ${
        compact ? "w-20" : ""
      } hidden lg:block sticky top-8 self-start`}
    >
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <div className="mb-4">
          <div className="text-lg font-bold">Throttel Admin</div>
          <div className="text-xs text-white/60">Control center</div>
        </div>

        <nav className="space-y-1" aria-label="Admin navigation">
          {items.map((it) => {
            const active = isActive(it.path);
            return (
              <button
                key={it.id}
                onClick={() => router.push(it.path)}
                aria-current={active ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  active
                    ? "bg-white text-black font-semibold"
                    : "text-white/70 hover:bg-white/6"
                }`}
              >
                <span className="w-6 h-6 grid place-items-center">
                  {it.icon}
                </span>
                <span className="truncate">{it.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-white/6 pt-4 text-sm text-white/60">
          <div>Signed in as admin</div>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 rounded-md backdrop-blur-sm bg-white/8">
              Invite
            </button>
            <button className="px-3 py-1 rounded-md">Sign out</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
