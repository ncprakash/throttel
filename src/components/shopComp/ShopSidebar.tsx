// components/shopComp/ShopSidebar.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp, FaTimes, FaBars } from "react-icons/fa";

type Category = { category_id: string; name: string };
type Brand = { brand_id: string; name: string; slug?: string };
type Bike = {
  bike_id?: string;
  name: string;
  model?: string;
  slug?: string;
  compatible?: boolean;
};

export default function ShopSidebar({
  onSelectCategory,
  onSelectBike,
  className = "",
}: {
  onSelectCategory?: (cat: string) => void;
  onSelectBike?: (bike: string) => void;
  className?: string;
}) {
  const [openPanel, setOpenPanel] = useState<"categories" | "brands" | null>(
    "categories"
  );

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [catsLoading, setCatsLoading] = useState(false);
  const [catsError, setCatsError] = useState<string | null>(null);

  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  // bikes per brand name, built from same /api/compatible data
  const [bikesByBrand, setBikesByBrand] = useState<Record<string, Bike[]>>({});

  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setCatsLoading(true);
    setCatsError(null);
    try {
      const res = await axios.get("/api/admin/categories");
      const data = res.data.categories || res.data || [];
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to load categories", err);
      setCatsError("Failed to load categories");
      setCategories([]);
    } finally {
      setCatsLoading(false);
    }
  }, []);

  // Single call: build brands and their bike models from compatibility array
  const fetchBrandsAndBikes = useCallback(async () => {
    setBrandsLoading(true);
    setBrandsError(null);
    try {
      const res = await axios.get("/api/compatible");
      // expected: { success: true, compatibility: [...] }
      const compat = res.data.compatibility || [];

      const seenBrands = new Set<string>();
      const brandList: Brand[] = [];
      const bikesMap: Record<string, Bike[]> = {};

      compat.forEach((row: any, i: number) => {
        const brandName = row.bike_brand;
        const modelName = row.bike_model;
        if (!brandName) return;

        const brandKey = String(brandName).trim();
        // create brand entry if not seen
        if (!seenBrands.has(brandKey)) {
          seenBrands.add(brandKey);
          brandList.push({
            brand_id: row.bike_brand_id ?? `compat-${i}`,
            name: brandKey,
            slug: brandKey.toLowerCase(),
          });
          bikesMap[brandKey] = [];
        }

        if (modelName) {
          const modelKey = String(modelName).trim();
          // ensure bikesMap entry exists
          if (!bikesMap[brandKey]) bikesMap[brandKey] = [];
          // avoid duplicate models per brand
          if (!bikesMap[brandKey].some((b) => b.name === modelKey)) {
            bikesMap[brandKey].push({
              bike_id: row.bike_id ?? `${brandKey}-${modelKey}`,
              name: modelKey,
              model: modelKey,
              compatible: true,
            });
          }
        }
      });

      setBrands(brandList);
      setBikesByBrand(bikesMap);
    } catch (err: any) {
      console.error("Failed to load brands", err);
      setBrandsError("Failed to load brands");
      setBrands([]);
      setBikesByBrand({});
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  // load initial lists lazily
  useEffect(() => {
    if (openPanel === "categories" && categories == null && !catsLoading)
      fetchCategories();
    if (openPanel === "brands" && brands == null && !brandsLoading)
      fetchBrandsAndBikes();
  }, [
    openPanel,
    categories,
    catsLoading,
    fetchCategories,
    brands,
    brandsLoading,
    fetchBrandsAndBikes,
  ]);

  const handleSelectCategory = (c: Category) => {
    onSelectCategory?.(c.name ?? c.category_id);
    setDrawerOpen(false);
  };

  const handleSelectBike = (b: Bike) => {
    onSelectBike?.(b.name ?? b.bike_id ?? "");
    setDrawerOpen(false);
  };

  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>(
    {}
  );

  return (
    <>
      {/* mobile toggle */}
      <div className="lg:hidden fixed bottom-6 left-6 z-[60]">
        <button
          onClick={() => setDrawerOpen((s) => !s)}
          className="p-3 rounded-full bg-black/70 border border-white/10 text-white shadow-lg"
          aria-expanded={drawerOpen}
          aria-label="Open filters"
        >
          {drawerOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <aside
        className={`${className} ${
          drawerOpen ? "fixed inset-0 z-40" : "relative"
        }`}
        aria-label="Shop filters"
      >
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            aria-hidden
          />
        )}

        <div
          className={`${
            drawerOpen
              ? "fixed top-0 left-0 bottom-0 w-80 z-40 lg:relative lg:w-72"
              : "relative w-full lg:relative lg:w-72"
          }`}
        >
          <div className="glass-panel h-full p-4 rounded-2xl border border-white/10 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">Filters</h4>
              <div>
                <button
                  onClick={() => {
                    setOpenPanel(null);
                    setDrawerOpen(false);
                  }}
                  className="text-xs text-white/60 px-2 py-1 rounded hover:bg-white/6"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Categories */}
              <div>
                <button
                  onClick={() =>
                    setOpenPanel((p) =>
                      p === "categories" ? null : "categories"
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/6 transition"
                  aria-expanded={openPanel === "categories"}
                >
                  <span className="font-medium">Categories</span>
                  <span className="text-white/60">
                    {openPanel === "categories" ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </span>
                </button>

                {openPanel === "categories" && (
                  <div className="mt-2 space-y-2">
                    {catsLoading ? (
                      <div className="text-sm text-white/60">Loading...</div>
                    ) : catsError ? (
                      <div className="text-sm text-red-400">{catsError}</div>
                    ) : categories && categories.length > 0 ? (
                      <ul className="space-y-1">
                        {categories.map((c) => (
                          <li key={c.category_id}>
                            <button
                              onClick={() => handleSelectCategory(c)}
                              className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 transition flex items-center justify-between"
                            >
                              <span className="truncate">{c.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-white/60">
                        No categories
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Brands + models (no extra API calls) */}
              <div>
                <button
                  onClick={() =>
                    setOpenPanel((p) => (p === "brands" ? null : "brands"))
                  }
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/6 transition"
                  aria-expanded={openPanel === "brands"}
                >
                  <span className="font-medium">Bike Brands</span>
                  <span className="text-white/60">
                    {openPanel === "brands" ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </span>
                </button>

                {openPanel === "brands" && (
                  <div className="mt-2">
                    {brandsLoading ? (
                      <div className="text-sm text-white/60">
                        Loading brands...
                      </div>
                    ) : brandsError ? (
                      <div className="text-sm text-red-400">{brandsError}</div>
                    ) : brands && brands.length > 0 ? (
                      <div className="space-y-2">
                        {brands.map((b) => {
                          const key = b.name || b.brand_id;
                          const bikes = bikesByBrand[key] ?? [];

                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => {
                                    setExpandedBrands((s) => ({
                                      ...s,
                                      [key]: !s[key],
                                    }));
                                  }}
                                  className="text-left px-2 py-1 rounded-md w-full hover:bg-white/5 flex items-center justify-between"
                                >
                                  <span className="truncate">{b.name}</span>
                                  <span className="text-white/50 text-xs">
                                    {bikes.length || ""}
                                  </span>
                                </button>
                              </div>

                              {expandedBrands[key] && (
                                <div className="ml-3 mt-1 space-y-1">
                                  {bikes.length === 0 && (
                                    <div className="text-xs text-white/60">
                                      No models
                                    </div>
                                  )}
                                  {bikes.map((bk) => (
                                    <button
                                      key={bk.bike_id ?? bk.name}
                                      onClick={() => handleSelectBike(bk)}
                                      className="w-full text-left px-3 py-1 rounded-md hover:bg-white/5 text-sm"
                                    >
                                      {bk.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text:white/60">No brands</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-white/6 pt-3 flex gap-2">
              <button
                onClick={() => {
                  setCategories(null);
                  setBrands(null);
                  setBikesByBrand({});
                  fetchCategories();
                  fetchBrandsAndBikes();
                }}
                className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 text-sm"
              >
                Refresh
              </button>
              <button
                onClick={() => {
                  onSelectCategory?.("");
                  onSelectBike?.("");
                }}
                className="px-3 py-2 rounded-md border border:white/6 text-sm"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
