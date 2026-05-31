"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ShopHeader from "@/components/shopComp/Header";
import ProductGrid from "@/components/shopComp/productCard";
import BottomNav from "@/components/BottomNavbar";
import { FaTimes } from "react-icons/fa";
import Footer from "@/components/Footer";

export default function ShopPage() {
  const [sortBy, setSortBy] = useState("featured");

  const [searchFilter, setSearchFilter] = useState("");
  const [filterType, setFilterType] = useState<"bike" | "category" | "">("");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchFilter) {
      fetchAllProducts();
      return;
    }

    if (filterType === "bike") {
      fetchProductsByBike(searchFilter);
    } else if (filterType === "category") {
      fetchProductsByCategory(searchFilter);
    } else {
      fetchProductsByBike(searchFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter, filterType]);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
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
    } catch (err) {
      console.error("Error searching products by bike:", err);
      setError("Failed to search products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      try {
        response = await axios.get(
          `/api/products?category=${encodeURIComponent(category)}`
        );
      } catch (err) {
        response = await axios.get(
          `/api/products/search?category=${encodeURIComponent(category)}`
        );
      }
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Error searching products by category:", err);
      setError("Failed to search products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSelectCategory = (cat: string) => {
    setFilterType("category");
    setSearchFilter(cat || "");
  };

  return (
    <>
      {/* Animated brand stripe */}
      <div className="w-full border-b border-white/5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.5em] text-white/15 uppercase px-8 py-3 flex-shrink-0"
            >
              Throttle Forged Customs · Performance Parts ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-screen bg-transparent text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="relative z-40">
              <ShopHeader
                totalResults={sortedProducts.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onSearchSelect={(val: string) => {
                  setFilterType("bike");
                  setSearchFilter(val);
                }}
                onCategorySelect={(cat: string) => {
                  setFilterType("category");
                  setSearchFilter(cat);
                }}
              />
            </div>

            {/* Content area */}
            <div className="relative z-10 pt-2 space-y-6">
              {/* Active Filter Badge */}
              {searchFilter && (
                <div className="relative z-30 border border-white/8 rounded-2xl p-4 bg-white/[0.02] backdrop-blur-sm">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
                        Filtering by
                      </span>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-sm font-medium text-white truncate max-w-xs">
                          {searchFilter}
                        </span>
                        <button
                          onClick={() => {
                            setSearchFilter("");
                            setFilterType("");
                          }}
                          className="text-white/40 hover:text-white transition-colors p-0.5"
                          aria-label="Clear filter"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-white/40">
                      {sortedProducts.length}{" "}
                      {sortedProducts.length === 1 ? "result" : "results"}
                    </span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="relative z-30 border border-white/8 rounded-2xl p-8 text-center bg-white/[0.02]">
                  <p className="text-white/70 mb-4">{error}</p>
                  <button
                    onClick={() =>
                      searchFilter
                        ? filterType === "category"
                          ? fetchProductsByCategory(searchFilter)
                          : fetchProductsByBike(searchFilter)
                        : fetchAllProducts()
                    }
                    className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Loading */}
              {loading ? (
                <div className="relative z-20 flex items-center justify-center py-40">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-8">
                      <div className="absolute inset-0 border border-white/10 rounded-full" />
                      <div className="absolute inset-0 border border-transparent border-t-white/60 rounded-full animate-spin" />
                    </div>
                    <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase">
                      Loading products
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Products */}
                  <div className="relative z-10">
                    {sortedProducts.length > 0 ? (
                      <ProductGrid
                        products={sortedProducts}
                        viewMode="grid"
                      />
                    ) : (
                      <div className="flex items-center justify-center py-40">
                        <div className="text-center max-w-sm">
                          <div className="text-[8rem] font-black text-white/[0.04] leading-none mb-6 select-none">
                            ∅
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">
                            {searchFilter ? "No Matches" : "No Products Yet"}
                          </h3>
                          <p className="text-sm text-white/50 mb-8 leading-relaxed">
                            {searchFilter
                              ? `Nothing found for "${searchFilter}". Try a different search.`
                              : "Our catalog is being updated. Check back soon."}
                          </p>
                          {searchFilter && (
                            <button
                              onClick={() => {
                                setSearchFilter("");
                                setFilterType("");
                              }}
                              className="px-6 py-3 rounded-xl border border-white/15 text-sm font-semibold hover:bg-white/5 transition-colors"
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
        </div>
      </div>

      <BottomNav />
      <Footer />
    </>
  );
}
