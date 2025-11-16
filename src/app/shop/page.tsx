// app/shop/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ShopHeader from "@/components/shopComp/Header";
import FilterSidebar from "@/components/shopComp/ActiveFilter";
import ProductGrid from "@/components/shopComp/productCard";
import BottomNav from "@/components/BottomNavbar";

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState([
    { id: "akrapovic", label: "Akrapovič", type: "checkbox" as const },
  ]);

  // Fetch all products on initial load
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Fetch products when search filter changes
  useEffect(() => {
    if (searchFilter) {
      fetchProductsByBike(searchFilter);
    } else {
      fetchAllProducts();
    }
  }, [searchFilter]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByBike = async (bikeModel: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/products/search?bikeModel=${bikeModel}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-32">
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
          totalResults={products.length}
          currentView={viewMode}
          onViewChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSearchSelect={setSearchFilter}
        />

        {/* Active Search Filter Badge */}
        {searchFilter && (
          <div className="mb-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Filtered by bike model:</span>
                <div className="backdrop-blur-md bg-purple-500/20 border border-purple-500/30 px-4 py-1.5 rounded-lg text-purple-300 font-semibold flex items-center gap-2">
                  🏍️ {searchFilter}
                  <button
                    onClick={() => setSearchFilter("")}
                    className="hover:text-white transition-colors ml-2 text-purple-200"
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <span className="text-white/60 text-sm">
                {products.length} {products.length === 1 ? "product" : "products"} found
              </span>
            </div>
          </div>
        )}

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

          {/* Loading State */}
          {loading ? (
            <div className="lg:col-span-1 flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60 text-lg">Loading products...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            // Product Grid
            <ProductGrid products={products} viewMode={viewMode} />
          ) : (
            // Empty State
            <div className="lg:col-span-1 flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {searchFilter ? "No products found" : "No products available"}
                </h3>
                <p className="text-white/60 mb-6">
                  {searchFilter
                    ? `No products compatible with "${searchFilter}"`
                    : "Check back later for new products"}
                </p>
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter("")}
                    className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl text-white transition-all hover:scale-105"
                  >
                    Clear Filter & Show All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
