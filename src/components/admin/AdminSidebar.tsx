// components/admin/AdminSidebar.tsx
"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
};

const items: NavItem[] = [
  {
    id: "products",
    label: "Products",
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

export default function AdminSidebar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/profile");
  };

  const isActive = (path: string) => {
    if (pathname === path || pathname === path + "/") return true;
    return pathname.startsWith(path.endsWith("/") ? path : path + "/");
  };

  const SidebarContent = (
    <div className="glass-panel h-full p-4 rounded-2xl border border-white/10 flex flex-col bg-black/70">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold truncate">Throttel Admin</div>
          <div className="text-xs text-white/60">Control center</div>
        </div>

        {/* Close button on mobile */}
        <button
          className="lg:hidden text-white/70 hover:text-white"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto" aria-label="Admin navigation">
        {items.map((it) => {
          const active = isActive(it.path);
          return (
            <button
              key={it.id}
              onClick={() => {
                router.push(it.path);
                setOpen(false);
              }}
              aria-current={active ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all
                ${active ? "bg-white text-black font-semibold" : "text-white/70 hover:bg-white/6"}
              `}
            >
              <span className="w-6 h-6 grid place-items-center">{it.icon}</span>
              {!compact && <span className="truncate">{it.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4 text-sm text-white/60">
        {!compact && <div className="mb-2">Signed in as admin</div>}
        <button
          className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm w-full text-left"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="lg:hidden px-4 py-2 flex items-center justify-between sticky top-0 z-30 bg-black/80 backdrop-blur">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md border border-white/10 text-white/80"
          aria-label="Open admin sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="text-sm text-white/70 font-medium truncate">
          Throttel Admin
        </span>
      </div>

      {/* Mobile overlay sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        {/* Drawer */}
        <aside
          className={`absolute top-0 left-0 h-full w-72 max-w-[80%] transform transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {SidebarContent}
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block sticky top-4 self-start ${
          compact ? "w-20" : "w-72"
        }`}
      >
        {SidebarContent}
      </aside>
    </>
  );
}
