// components/admin/BrandsList.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp, FaSync, FaDownload } from "react-icons/fa";

/**
 * BrandsList
 *
 * - Tries GET /api/admin/brands
 * - Fallback: GET /api/admin/products and aggregates brands from each product's compatibility rows
 * - Expands brands to list products and stock (via /api/admin/products?brand=... if available,
 *   otherwise filters the already-fetched products).
 */

type Product = {
  product_id?: string;
  name?: string;
  sku?: string;
  stock_quantity?: number;
  regular_price?: number;
  sale_price?: number | null;
  primary_image_url?: string;
  images?: any[];
  compatibility?: { bike_brand?: string; bike_model?: string }[];
  // add other fields your API returns
};

type Brand = {
  name: string;
  productCount: number;
  totalStock: number;
  // optional list of product ids in fallback mode
  products?: Product[];
};

export default function BrandsList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [allProductsCache, setAllProductsCache] = useState<Product[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadBrands() {
    setLoading(true);
    setError(null);
    try {
      // Try a direct brands endpoint first (preferred).
      const brandsRes = await axios.get("/api/admin/brands").catch(() => null);

      if (
        brandsRes &&
        brandsRes.data &&
        Array.isArray(brandsRes.data.brands || brandsRes.data)
      ) {
        // If backend returns structured brands
        const payload = brandsRes.data.brands || brandsRes.data;
        // Normalize to our Brand type (server may already include counts)
        const normalized: Brand[] = payload.map((b: any) => ({
          name: b.name || b.brand || b.make || "Unknown",
          productCount: b.productCount ?? b.count ?? 0,
          totalStock: b.totalStock ?? b.stock_total ?? 0,
        }));
        setBrands(normalized.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
        return;
      }

      // FALLBACK: fetch all products and aggregate by compatibility bike_brand entries
      const prodRes = await axios.get("/api/admin/products");
      const prods: Product[] = prodRes.data.products || prodRes.data || [];
      setAllProductsCache(prods);

      // Attempt to detect a product-level brand field (e.g., product.brand)
      const brandFromProductField = prods.some((p) => (p as any).brand);

      const map = new Map<
        string,
        { products: Product[]; totalStock: number }
      >();

      prods.forEach((p) => {
        if (brandFromProductField) {
          const brand = ((p as any).brand || "Unknown").toString();
          const entry = map.get(brand) ?? { products: [], totalStock: 0 };
          entry.products.push(p);
          entry.totalStock += Number(p.stock_quantity ?? 0);
          map.set(brand, entry);
        } else if (
          Array.isArray(p.compatibility) &&
          p.compatibility.length > 0
        ) {
          p.compatibility.forEach((c: any) => {
            const brand = (c?.bike_brand || "Unknown").toString();
            const entry = map.get(brand) ?? { products: [], totalStock: 0 };
            // avoid duplicate product entries per brand
            if (!entry.products.find((x) => x.product_id === p.product_id)) {
              entry.products.push(p);
              entry.totalStock += Number(p.stock_quantity ?? 0);
              map.set(brand, entry);
            }
          });
        } else {
          // If product has no compat info, lump under "Uncategorized"
          const brand = "Uncategorized";
          const entry = map.get(brand) ?? { products: [], totalStock: 0 };
          entry.products.push(p);
          entry.totalStock += Number(p.stock_quantity ?? 0);
          map.set(brand, entry);
        }
      });

      const aggregated = Array.from(map.entries()).map(
        ([name, { products, totalStock }]) => ({
          name,
          productCount: products.length,
          totalStock,
          products,
        })
      );

      setBrands(aggregated.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error("Brands load failed", err);
      setError("Could not load brands");
    } finally {
      setLoading(false);
    }
  }

  // Expand/collapse brand
  const toggle = (name: string) => {
    setExpanded((s) => ({ ...s, [name]: !s[name] }));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        String(b.productCount).includes(q) ||
        String(b.totalStock).includes(q)
    );
  }, [brands, search]);

  // Try to fetch brand-specific products from server if route exists, fallback to cached products
  const fetchProductsForBrand = async (brandName: string) => {
    // If we already have products in state, no need
    const b = brands.find((x) => x.name === brandName);
    if (b?.products && b.products.length > 0) return;

    try {
      // preferred server endpoint
      const res = await axios
        .get("/api/admin/products", { params: { brand: brandName } })
        .catch(() => null);
      if (res && res.data && Array.isArray(res.data.products || res.data)) {
        const prods: Product[] = res.data.products || res.data;
        setBrands((prev) =>
          prev.map((x) =>
            x.name === brandName ? { ...x, products: prods } : x
          )
        );
        return;
      }

      // fallback: use cached allProductsCache and filter by compatibility or brand field
      if (allProductsCache) {
        const matches = allProductsCache.filter((p) => {
          if ((p as any).brand) {
            return (
              ((p as any).brand || "").toLowerCase() === brandName.toLowerCase()
            );
          }
          if (Array.isArray(p.compatibility)) {
            return p.compatibility.some(
              (c: any) =>
                (c?.bike_brand || "").toLowerCase() === brandName.toLowerCase()
            );
          }
          return false;
        });
        setBrands((prev) =>
          prev.map((x) =>
            x.name === brandName ? { ...x, products: matches } : x
          )
        );
      }
    } catch (err) {
      console.warn("Could not fetch products for brand", brandName, err);
    }
  };

  // CSV export helper
  const exportCSV = () => {
    const rows: string[] = [];
    rows.push(
      "brand,product_id,product_name,sku,stock,regular_price,sale_price"
    );
    brands.forEach((b) => {
      (b.products || []).forEach((p) => {
        rows.push(
          `"${b.name}","${p.product_id || ""}","${(p.name || "").replace(
            /"/g,
            '""'
          )}","${p.sku || ""}",${p.stock_quantity ?? 0},${
            p.regular_price ?? ""
          },${p.sale_price ?? ""}`
        );
      });
      if (!b.products || b.products.length === 0) {
        rows.push(`"${b.name}","","","","","",`);
      }
    });
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brands_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Brands</h2>
          <p className="text-sm text-white/60">
            View brands and their cataloged products & stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            title="Export CSV"
            onClick={exportCSV}
            className="px-3 py-2 rounded-md backdrop-blur-sm bg-white/8 hover:bg-white/12"
          >
            <FaDownload className="inline-block mr-2" /> Export
          </button>
          <button
            title="Refresh"
            onClick={loadBrands}
            className="px-3 py-2 rounded-md backdrop-blur-sm bg-white/8 hover:bg-white/12"
          >
            <FaSync />
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands, counts or stock"
            className="flex-1 px-3 py-2 rounded-md bg-transparent border border-white/10"
          />
        </div>

        {loading ? (
          <div className="py-6 text-center text-white/60">Loading brands…</div>
        ) : error ? (
          <div className="py-6 text-center text-rose-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-6 text-center text-white/60">No brands found</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.name}
                className="p-3 rounded-md bg-white/3 border border-white/6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-md bg-white/6 grid place-items-center text-sm font-medium">
                      {b.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{b.name}</div>
                      <div className="text-xs text-white/60">
                        Products: {b.productCount} • Stock: {b.totalStock}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        toggle(b.name);
                        if (!expanded[b.name])
                          await fetchProductsForBrand(b.name);
                      }}
                      className="px-3 py-1 rounded-md backdrop-blur-sm bg-white/8"
                    >
                      {expanded[b.name] ? (
                        <span className="flex items-center gap-2">
                          <FaChevronUp /> Hide
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaChevronDown /> View
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {expanded[b.name] && (
                  <div className="mt-3 space-y-2">
                    {b.products && b.products.length > 0 ? (
                      b.products.map((p) => (
                        <div
                          key={p.product_id || p.name}
                          className="p-3 rounded-md bg-black/40 border border-white/6 flex items-center gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{p.name}</div>
                            <div className="text-xs text-white/60 truncate">
                              {p.sku ?? "—"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {p.stock_quantity ?? 0}
                            </div>
                            <div className="text-xs text-white/60">
                              {p.regular_price
                                ? `$${Number(p.regular_price).toFixed(2)}`
                                : "-"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-white/60 p-3">
                        No products found for this brand.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
