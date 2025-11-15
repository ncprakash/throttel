// app/shop/page.tsx
"use client";

import { useState } from "react";
import ShopHeader from "@/components/shopComp/Header";
import FilterSidebar from "@/components/shopComp/ActiveFilter";
import ProductGrid from "@/components/shopComp/productCard";

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([
    { id: "akrapovic", label: "Akrapovič", type: "checkbox" as const },
  ]);

  // Mock products data
  const products = [
    {
      id: "1",
      name: "Akrapovič Slip-On Line (Titanium) Exhaust",
      image: "/products/exhaust1.jpg",
      price: 1199.95,
      originalPrice: 1350.0,
      reviews: 128,
      stock: 5,
      compatibility: true,
      slug: "akrapovic-slip-on-line-titanium",
    },
    {
      id: "2",
      name: "Yoshimura R-77 Works Finish Slip-On Exhaust",
      image: "/products/exhaust2.jpg",
      price: 679.0,
      reviews: 92,
      stock: 3,
      compatibility: true,
      slug: "yoshimura-r77-works-finish",
    },
    {
      id: "3",
      name: "SC-Project SC1-R GT Slip-On Exhaust",
      image: "/products/exhaust3.jpg",
      price: 980.0,
      reviews: 78,
      stock: 1,
      compatibility: false,
      slug: "sc-project-sc1-r-gt",
    },
    {
      id: "4",
      name: "SC-Project SC1-R GT Slip-On Exhaust (Alt)",
      image: "/products/exhaust3.jpg",
      price: 980.0,
      reviews: 78,
      stock: 1,
      compatibility: false,
      slug: "sc-project-sc1-r-gt-alt",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b0d] via-[#060607] to-[#000000] text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open filters"
            className="
            lg:hidden fixed bottom-24 right-6 z-30
            backdrop-blur-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]
            text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all
          "
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-.447.894l-4 2A1 1 0 019 21v-8.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          </button>

          {/* Header */}
          <ShopHeader
            totalResults={products.length}
            currentView={viewMode}
            onViewChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Main Content */}
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            {/* Sidebar */}
            <FilterSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              activeFilters={activeFilters}
              onRemoveFilter={(id) =>
                setActiveFilters(activeFilters.filter((f) => f.id !== id))
              }
              onClearAll={() => setActiveFilters([])}
            />

            {/* Product Grid */}
            <ProductGrid products={products} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </>
  );
}
