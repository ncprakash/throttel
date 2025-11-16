// app/shop/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ShopHeader from "@/components/shopComp/Header";
import ProductGrid from "@/components/shopComp/productCard";
import BottomNav from "@/components/BottomNavbar";
import { FaTimes } from "react-icons/fa";

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchFilter, setSearchFilter] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Handle search filter changes
  useEffect(() => {
    if (searchFilter) {
      fetchProductsByBike(searchFilter);
    } else {
      fetchAllProducts();
    }
  }, [searchFilter]);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByBike = async (bikeModel: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/products/search?bikeModel=${encodeURIComponent(bikeModel)}`
      );
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Failed to search products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    switch (sortBy) {
      case "price-low":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-high":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "newest":
        return productsCopy.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      case "popular":
        return productsCopy.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "featured":
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header (higher stacking context) */}
        <div className="relative z-40">
          <ShopHeader
            totalResults={sortedProducts.length}
            currentView={viewMode}
            onViewChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSearchSelect={setSearchFilter}
          />
        </div>

        {/* Content area — keep a little padding-top so header overlays don't overlap */}
        <div className="relative z-10 pt-2 space-y-6">
          {/* Active Filter Badge (monochrome) */}
          {searchFilter && (
            <div className="mb-0 relative z-30 glass-panel border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-white/80 text-sm font-medium">
                    Filtering by:
                  </span>
                  <div className="backdrop-blur-md bg-white/6 border border-white/12 px-4 py-2 rounded-xl text-white font-medium flex items-center gap-3">
                    <span className="text-xl">🏍️</span>
                    <span className="truncate max-w-xs">{searchFilter}</span>
                    <button
                      onClick={() => setSearchFilter("")}
                      className="hover:bg-white/10 p-1 rounded-md transition-colors ml-1"
                      aria-label="Clear filter"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <span className="text-white/60 text-sm">
                  {sortedProducts.length} compatible{" "}
                  {sortedProducts.length === 1 ? "product" : "products"}
                </span>
              </div>
            </div>
          )}

          {/* Error State (monochrome) */}
          {error && (
            <div className="relative z-30 glass-panel border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-white/80 text-lg font-semibold mb-2">
                ⚠️ {error}
              </div>
              <button
                onClick={() =>
                  searchFilter
                    ? fetchProductsByBike(searchFilter)
                    : fetchAllProducts()
                }
                className="backdrop-blur-md bg-white/8 hover:bg-white/12 border border-white/12 px-6 py-2 rounded-xl text-white transition-all hover:scale-105 mt-3"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State (monochrome) */}
          {loading ? (
            <div className="relative z-20 flex items-center justify-center py-32">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin" />
                  <div
                    className="absolute inset-2 border-4 border-transparent border-t-white rounded-full animate-spin"
                    style={{
                      animationDirection: "reverse",
                      animationDuration: "1s",
                    }}
                  />
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">
                  Loading products...
                </p>
                <p className="text-white/50 text-sm">
                  Please wait while we fetch the latest items
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Product area: lower stacking context so header / badges stay above */}
              <div className="relative z-10">
                {sortedProducts.length > 0 ? (
                  <ProductGrid products={sortedProducts} viewMode={viewMode} />
                ) : (
                  <div className="flex items-center justify-center py-32">
                    <div className="text-center max-w-md">
                      <div className="w-32 h-32 mx-auto mb-8 rounded-full glass-panel flex items-center justify-center border border-white/10">
                        <svg
                          className="w-16 h-16 text-white/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3">
                        {searchFilter ? "No Matches Found" : "No Products Yet"}
                      </h3>
                      <p className="text-white/60 text-lg mb-8">
                        {searchFilter
                          ? `We couldn't find any products compatible with "${searchFilter}". Try a different bike model or browse all products.`
                          : "Our catalog is being updated. Check back soon for exciting new products!"}
                      </p>
                      {searchFilter && (
                        <button
                          onClick={() => setSearchFilter("")}
                          className="backdrop-blur-md bg-white/8 hover:bg-white/12 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 border border-white/12"
                        >
                          View All Products
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
