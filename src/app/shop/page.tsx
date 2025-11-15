// app/shop/page.tsx
"use client";

import { useState } from "react";
import ShopHeader from "@/components/shopComp/Header";
import FilterSidebar from "@/components/shopComp/ActiveFilter";
import ProductGrid from "@/components/shopComp/productCard"
import BottomNav from "@/components/BottomNavbar";

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
    },
    {
      id: "2",
      name: "Yoshimura R-77 Works Finish Slip-On Exhaust",
      image: "/products/exhaust2.jpg",
      price: 679.0,
     
      reviews: 92,
      stock: 3,
      compatibility: true,
    },
    {
      id: "3",
      name: "SC-Project SC1-R GT Slip-On Exhaust",
      image: "/products/exhaust3.jpg",
      price: 980.0,
   
      reviews: 78,
      stock: 1,
      compatibility: false,
    },{
      id: "4",
      name: "SC-Project SC1-R GT Slip-On Exhaust",
      image: "/products/exhaust3.jpg",
      price: 980.0,
   
      reviews: 78,
      stock: 1,
      compatibility: false,
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-24 right-6 z-30 backdrop-blur-xl bg-purple-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>

        {/* Header */}
        <ShopHeader
          totalResults={72}
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
      <BottomNav/>
    </div>
  );
}
