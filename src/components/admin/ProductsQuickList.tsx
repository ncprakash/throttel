// components/admin/ProductsQuickList.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsQuickList({
  onEdit,
}: {
  onEdit: (p: any) => void;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await axios.get("/api/admin/products");
      setProducts(r.data.products || r.data || []);
    } catch (err) {
      console.error("Products load failed", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // quick update patch
  const updateProduct = async (id: string, data: any) => {
    try {
      await axios.patch(`/api/admin/products/${id}`, data);
      // reload on success
      await load();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-2xl border border-white/8">
        <h4 className="font-semibold">Products</h4>
        {loading ? (
          <div className="py-4 text-white/60">Loading…</div>
        ) : (
          <div className="max-h-[60vh] overflow-auto space-y-2 mt-3">
            {products.map((p) => (
              <ProductRow
                key={p.product_id || p.id}
                product={p}
                onEdit={() => onEdit(p)}
                onPatch={updateProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onEdit,
  onPatch,
}: {
  product: any;
  onEdit: () => void;
  onPatch: (id: string, data: any) => void;
}) {
  // product.weight is assumed in kilograms (kg)
  const initialKg = product?.weight ?? 0;
  const [weightVal, setWeightVal] = useState<number | "">(initialKg ?? "");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");

  useEffect(() => {
    // reset when product changes
    setWeightVal(product?.weight ?? "");
    setWeightUnit("kg");
  }, [product]);

  const handleWeightBlur = () => {
    // convert to kg
    let numeric = Number(weightVal || 0);
    if (isNaN(numeric)) return;
    const kg = weightUnit === "g" ? numeric / 1000 : numeric;
    const rounded = Math.round(kg * 100) / 100;
    if (rounded !== (product.weight ?? 0)) {
      onPatch(product.product_id || product.id, { weight: rounded });
    }
  };

  return (
    <div className="p-3 rounded-md bg-white/3 border border-white/6 flex items-center gap-3">
      <div className="w-12 h-12 bg-white/6 rounded-md overflow-hidden flex items-center justify-center text-xs">
        {product.primary_image_url || product.image_url ? (
          <img
            src={product.primary_image_url || product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white/60">no img</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{product.name}</div>
        <div className="text-xs text-white/60">
          Stock: {product.stock_quantity ?? product.stock ?? 0}
        </div>
        <div className="text-xs text-white/60 mt-1">
          Weight: {(product.weight ?? 0).toFixed(2)} kg
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.01"
          min={0}
          value={weightVal as any}
          onChange={(e) =>
            setWeightVal(e.target.value === "" ? "" : Number(e.target.value))
          }
          onBlur={handleWeightBlur}
          className="w-20 px-2 py-1 rounded-md bg-transparent border border-white/10 text-sm"
        />
        <select
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value as "kg" | "g")}
          className="px-2 py-1 rounded-md bg-transparent border border-white/10 text-sm"
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
        </select>

        <button onClick={onEdit} className="px-3 py-1 rounded-md bg-white/8">
          Edit
        </button>
      </div>
    </div>
  );
}
