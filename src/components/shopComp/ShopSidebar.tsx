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

/**
 * ShopSidebar - loads compatible bike models per brand via /api/compatible when available
 * Props:
 *  - onSelectCategory?: (catNameOrId) => void
 *  - onSelectBike?: (bikeNameOrId) => void
 */
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

  // bikes cache per brandName (use brand.name as key since compatible endpoint filters by brand name)
  const [bikesByBrand, setBikesByBrand] = useState<Record<string, Bike[]>>({});
  const [bikesLoadingFor, setBikesLoadingFor] = useState<string | null>(null);
  const [bikesErrorFor, setBikesErrorFor] = useState<Record<string, string>>(
    {}
  );

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

  const fetchBrands = useCallback(async () => {
    setBrandsLoading(true);
    setBrandsError(null);
    try {
      const res = await axios.get("/api/brands");
      const data = res.data.brands || res.data || [];
      setBrands(data);
    } catch (err: any) {
      console.error("Failed to load brands", err);
      setBrandsError("Failed to load brands");
      setBrands([]);
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  /**
   * NEW: fetch bikes for brand using compatibility endpoint first:
   * 1) Try: /api/compatible?bike_brand=<brandName>
   *    - expects rows with bike_model (or bike_model + bike_id)
   *    - derive unique bike models and map to Bike[]
   * 2) If that fails or returns nothing, fallback to /api/bikes?brand=<brandId>
   */
  const fetchBikesForBrand = useCallback(
    async (brand: Brand) => {
      if (!brand) return;
      const key = brand.name || brand.brand_id;
      if (!key) return;

      // already loaded
      if (bikesByBrand[key]) return;

      setBikesLoadingFor(key);
      setBikesErrorFor((s) => ({ ...s, [key]: "" }));

      try {
        // 1) Try compatibility endpoint (server-side filtered)
        let compatResp = null;
        try {
          compatResp = await axios.get(
            `/api/compatible?bike_brand=${encodeURIComponent(brand.name)}`
          );
        } catch (err) {
          compatResp = null;
        }

        let bikes: Bike[] | null = null;

        if (
          compatResp &&
          compatResp.data &&
          Array.isArray(compatResp.data.compatibility)
        ) {
          // derive unique bike models from compatibility rows
          const rows = compatResp.data.compatibility;
          const seen = new Set<string>();
          bikes = rows
            .map((r: any, i: number) => {
              const name = r.bike_model || r.model || r.bike_name;
              if (!name) return null;
              const keyName = String(name).trim();
              if (seen.has(keyName)) return null;
              seen.add(keyName);
              return {
                bike_id: r.bike_id ?? `${brand.brand_id}-${i}`,
                name: keyName,
                model: keyName,
                compatible: true,
              } as Bike;
            })
            .filter(Boolean) as Bike[];
        }

        // if no bikes from compat endpoint, fallback to /api/bikes?brand=<brand_id>
        if (!bikes || bikes.length === 0) {
          try {
            const res = await axios.get(
              `/api/bikes?brand=${encodeURIComponent(
                brand.brand_id || brand.name
              )}`
            );
            const allBikes = res.data.bikes || res.data || [];
            // If bikes have 'compatible' flag, filter by it, else assume all (best-effort)
            bikes = Array.isArray(allBikes)
              ? (allBikes as any[]).filter((bk) =>
                  typeof bk.compatible !== "undefined"
                    ? Boolean(bk.compatible)
                    : true
                )
              : [];
          } catch (err) {
            // if fallback failed, set empty array (we want to show "No compatible models")
            bikes = [];
          }
        }

        setBikesByBrand((s) => ({ ...s, [key]: bikes }));
      } catch (err: any) {
        console.error("Failed to load bikes for brand", key, err);
        setBikesErrorFor((s) => ({ ...s, [key]: "Failed to load models" }));
        setBikesByBrand((s) => ({ ...s, [key]: [] }));
      } finally {
        setBikesLoadingFor((id) => (id === key ? null : id));
      }
    },
    [bikesByBrand]
  );

  // load initial lists lazily
  useEffect(() => {
    if (openPanel === "categories" && categories == null && !catsLoading)
      fetchCategories();
    if (openPanel === "brands" && brands == null && !brandsLoading)
      fetchBrands();
  }, [
    openPanel,
    categories,
    catsLoading,
    fetchCategories,
    brands,
    brandsLoading,
    fetchBrands,
  ]);

  const handleSelectCategory = (c: Category) => {
    onSelectCategory?.(c.name ?? c.category_id);
    setDrawerOpen(false);
  };

  const handleSelectBike = (b: Bike) => {
    onSelectBike?.(b.name ?? b.bike_id ?? "");
    setDrawerOpen(false);
  };

  // simple expandedBrands state to toggle expand/collapse per-brand
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>(
    {}
  );

  return (
    <>
      {/* mobile toggle (still present if you want the drawer) */}
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

        {/* <-- KEY CHANGE:
            - When drawerOpen is true: render as fixed drawer (same as before)
            - When drawerOpen is false: render inline full-width on mobile (w-full)
              and as a left column on lg (lg:w-72). This makes the sidebar visible
              at the top on small screens without requiring the drawer to be opened.
         */}
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
                      <div className="text-sm text-white/60">No categories</div>
                    )}
                  </div>
                )}
              </div>

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
                          const bikes = bikesByBrand[key] ?? null;
                          const isLoadingBikes = bikesLoadingFor === key;
                          const bikesError = bikesErrorFor[key];

                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => {
                                    // toggle expand
                                    setExpandedBrands((s) => ({
                                      ...s,
                                      [key]: !s[key],
                                    }));
                                    // fetch if expanding and not loaded
                                    if (!bikes && !isLoadingBikes)
                                      fetchBikesForBrand(b);
                                  }}
                                  className="text-left px-2 py-1 rounded-md w-full hover:bg-white/5 flex items-center justify-between"
                                >
                                  <span className="truncate">{b.name}</span>
                                  <span className="text-white/50 text-xs">
                                    {isLoadingBikes
                                      ? "…"
                                      : bikes
                                      ? `${bikes.length}`
                                      : ""}
                                  </span>
                                </button>
                              </div>

                              {/* bikes under brand (render if expanded) */}
                              {expandedBrands[key] && (
                                <div className="ml-3 mt-1 space-y-1">
                                  {isLoadingBikes && !bikes && (
                                    <div className="text-xs text-white/60">
                                      Loading models…
                                    </div>
                                  )}
                                  {bikes && bikes.length === 0 && (
                                    <div className="text-xs text-white/60">
                                      No compatible models
                                    </div>
                                  )}
                                  {bikes &&
                                    bikes.map((bk) => (
                                      <button
                                        key={bk.bike_id ?? bk.name}
                                        onClick={() => handleSelectBike(bk)}
                                        className="w-full text-left px-3 py-1 rounded-md hover:bg-white/5 text-sm"
                                      >
                                        {bk.name}
                                      </button>
                                    ))}
                                  {bikesError && (
                                    <div className="text-xs text-red-400">
                                      {bikesError}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-white/60">No brands</div>
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
                  fetchCategories();
                  fetchBrands();
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
                className="px-3 py-2 rounded-md border border-white/6 text-sm"
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
