// components/admin/ProductForm.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

type Category = { category_id: string; name: string };

type Props = {
  product?: any | null;
  onSaved?: (p: any) => void;
  onCancel?: () => void;
};

export default function ProductForm({ product, onSaved, onCancel }: Props) {
  const editing = Boolean(product?.product_id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [form, setForm] = useState({
    category_id: product?.category_id ?? "",
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    short_description: product?.short_description ?? "",
    description: product?.description ?? "",
    regular_price: product?.regular_price ?? "",
    sale_price: product?.sale_price ?? "",
    sku: product?.sku ?? "",
    stock_quantity: product?.stock_quantity ?? 0,
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    warranty_months: product?.warranty_months ?? 6,
    material: product?.material ?? "",
  });

  // Weight handling: value + unit (kg | g)
  const initialWeightKg = product?.weight ?? "";
  const [weightValue, setWeightValue] = useState<string | number>(
    initialWeightKg ?? ""
  );
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");

  // images (local preview + file)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // compatibility list
  const [compatList, setCompatList] = useState<
    {
      bike_brand?: string;
      bike_model?: string;
      year_from?: number | null;
      year_to?: number | null;
      notes?: string;
    }[]
  >(product?.compatibility || []);

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingCategories(true);
      try {
        const res = await axios.get("/api/admin/categories");
        setCategories(res.data.categories || res.data || []);
      } catch (err) {
        console.warn("Could not load categories:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!imageFiles.length) {
      setImagePreviews([]);
      return;
    }
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imageFiles]);

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  useEffect(() => {
    if (!editing) {
      const slug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9- ]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 200);
      setForm((s) => ({ ...s, slug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name]);

  const addCompat = () =>
    setCompatList((s) => [
      ...s,
      {
        bike_brand: "",
        bike_model: "",
        year_from: null,
        year_to: null,
        notes: "",
      },
    ]);

  const removeCompat = (idx: number) =>
    setCompatList((s) => s.filter((_, i) => i !== idx));

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      if (!form.name?.trim()) throw new Error("Product name is required");
      if (!form.slug?.trim()) throw new Error("Slug is required");
      if (!form.regular_price || Number(form.regular_price) <= 0)
        throw new Error("Regular price must be > 0");

      // convert weight to kilograms before sending
      let weightKg: number | null = null;
      if (weightValue !== "" && weightValue !== null) {
        const numeric = Number(weightValue || 0);
        if (!isNaN(numeric) && numeric > 0) {
          weightKg = weightUnit === "g" ? numeric / 1000 : numeric;
          // round to 2 decimals to match DECIMAL(8,2)
          weightKg = Math.round(weightKg * 100) / 100;
        }
      }

      const payload: any = {
        category_id: form.category_id || null,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description || null,
        short_description: form.short_description || null,
        regular_price: Number(form.regular_price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        sku: form.sku || null,
        stock_quantity: Number(form.stock_quantity || 0),
        is_active: Boolean(form.is_active),
        is_featured: Boolean(form.is_featured),
        weight: weightKg, // send weight in kilograms
        warranty_months: form.warranty_months || 6,
        warranty_description: product?.warranty_description ?? null,
        material: form.material || null,
      };

      let savedProd: any;
      if (editing && product.product_id) {
        const res = await axios.patch(
          `/api/admin/products/${product.product_id}`,
          payload
        );
        savedProd = res.data.product || res.data;
      } else {
        const res = await axios.post(`/api/admin/products`, payload);
        savedProd = res.data.product || res.data;
      }

      // upload images sequentially
      if (imageFiles.length > 0 && savedProd?.product_id) {
        for (let i = 0; i < imageFiles.length; i++) {
          const img = imageFiles[i];
          const fd = new FormData();
          fd.append("image", img);
          fd.append("alt_text", img.name);
          fd.append("display_order", String(i));
          fd.append("is_primary", i === 0 ? "true" : "false");
          try {
            await axios.post(
              `/api/admin/products/${savedProd.product_id}/images`,
              fd,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          } catch (err) {
            console.warn("Image upload failed for", img.name, err);
          }
        }
      }

      // compatibility entries
      if (compatList.length > 0 && savedProd?.product_id) {
        for (const c of compatList) {
          if (!c.bike_model?.trim()) continue;
          try {
            await axios.post(
              `/api/admin/products/${savedProd.product_id}/compatibility`,
              {
                bike_model: c.bike_model,
                bike_brand: c.bike_brand || null,
                year_from: c.year_from || null,
                year_to: c.year_to || null,
                notes: c.notes || null,
              }
            );
          } catch (err) {
            console.warn("Compat save failed", err);
          }
        }
      }

      setNotice("Saved successfully");
      onSaved?.(savedProd);
    } catch (err: any) {
      console.error("Save failed", err);
      setNotice(err?.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 2500);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setImageFiles((prev) => [...prev, ...arr].slice(0, 8));
  };

  const removePreviewAt = (idx: number) => {
    setImageFiles((s) => s.filter((_, i) => i !== idx));
    setImagePreviews((s) => s.filter((_, i) => i !== idx));
  };

  // If editing and product.weight exists, initialize properly (once)
  useEffect(() => {
    if (editing && product?.weight != null) {
      // product.weight is stored in kilograms. Keep unit as kg and value = weight
      setWeightValue(product.weight);
      setWeightUnit("kg");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  return (
    <form
      onSubmit={handleSave}
      className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {editing ? "Edit product" : "Create product"}
        </h3>
        <div className="text-sm text-white/60">
          {editing ? "Editing" : "New"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <label className="text-sm text-white/60">Name</label>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-white/60">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
              />
            </div>
            <div>
              <label className="text-sm text-white/60">SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setField("sku", e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
              />
            </div>
          </div>

          <label className="text-sm text-white/60">Short description</label>
          <input
            value={form.short_description}
            onChange={(e) => setField("short_description", e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />

          <label className="text-sm text-white/60">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />
        </div>

        <aside className="space-y-3">
          <label className="text-sm text-white/60">Category</label>
          <select
            value={form.category_id}
            onChange={(e) => setField("category_id", e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          >
            <option value="">— Select category —</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="text-sm text-white/60">Regular price</label>
          <input
            type="number"
            step="0.01"
            value={form.regular_price as any}
            onChange={(e) => setField("regular_price", e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />

          <label className="text-sm text-white/60">Sale price</label>
          <input
            type="number"
            step="0.01"
            value={form.sale_price as any}
            onChange={(e) => setField("sale_price", e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />

          <label className="text-sm text-white/60">Stock qty</label>
          <input
            type="number"
            value={form.stock_quantity as any}
            onChange={(e) =>
              setField("stock_quantity", Number(e.target.value || 0))
            }
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />

          <div className="flex gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setField("is_active", e.target.checked)}
              />
              <span className="text-white/70">Active</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setField("is_featured", e.target.checked)}
              />
              <span className="text-white/70">Featured</span>
            </label>
          </div>

          <label className="text-sm text-white/60">Material</label>
          <input
            value={form.material}
            onChange={(e) => setField("material", e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />

          {/* Weight input with unit selector */}
          <div>
            <label className="text-sm text-white/60">Weight</label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                step="0.01"
                min={0}
                value={weightValue as any}
                onChange={(e) => setWeightValue(e.target.value)}
                className="w-2/3 px-3 py-2 rounded-md bg-transparent border border-white/10"
                placeholder="0.00"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as "kg" | "g")}
                className="w-1/3 px-3 py-2 rounded-md bg-transparent border border-white/10"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
              </select>
            </div>
            <div className="text-xs text-white/60 mt-1">
              Enter weight and select unit. We store weight in kilograms (kg).
            </div>
          </div>
        </aside>
      </div>

      {/* Images */}
      <div>
        <label className="text-sm text-white/60">
          Images (drag & drop or pick files)
        </label>
        <div className="mt-2 flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-md bg-white text-black"
          >
            Select images
          </button>
          <div className="text-sm text-white/60 self-center">
            You can upload up to 8 images.
          </div>
        </div>

        {imagePreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className="relative rounded-md overflow-hidden border border-white/10"
              >
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePreviewAt(i)}
                  className="absolute top-1 right-1 bg-black/60 p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compatibility list */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/60">Compatibility</label>
          <button
            type="button"
            onClick={addCompat}
            className="px-3 py-1 rounded-md bg-white/8"
          >
            + Add row
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {compatList.length === 0 && (
            <div className="text-white/60 text-sm">
              No compatibility rows yet
            </div>
          )}
          {compatList.map((c, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end p-3 rounded-md bg-white/3 border border-white/6"
            >
              <div className="md:col-span-2">
                <label className="text-xs text-white/60">Brand</label>
                <input
                  value={c.bike_brand}
                  onChange={(e) =>
                    setCompatList((s) =>
                      s.map((x, i) =>
                        i === idx ? { ...x, bike_brand: e.target.value } : x
                      )
                    )
                  }
                  className="w-full px-2 py-1 rounded-md bg-transparent border border-white/10 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60">Model</label>
                <input
                  value={c.bike_model}
                  onChange={(e) =>
                    setCompatList((s) =>
                      s.map((x, i) =>
                        i === idx ? { ...x, bike_model: e.target.value } : x
                      )
                    )
                  }
                  className="w-full px-2 py-1 rounded-md bg-transparent border border-white/10 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/60">Year from</label>
                <input
                  type="number"
                  value={c.year_from ?? ""}
                  onChange={(e) =>
                    setCompatList((s) =>
                      s.map((x, i) =>
                        i === idx
                          ? {
                              ...x,
                              year_from: e.target.value
                                ? Number(e.target.value)
                                : null,
                            }
                          : x
                      )
                    )
                  }
                  className="w-full px-2 py-1 rounded-md bg-transparent border border-white/10 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/60">Year to</label>
                <input
                  type="number"
                  value={c.year_to ?? ""}
                  onChange={(e) =>
                    setCompatList((s) =>
                      s.map((x, i) =>
                        i === idx
                          ? {
                              ...x,
                              year_to: e.target.value
                                ? Number(e.target.value)
                                : null,
                            }
                          : x
                      )
                    )
                  }
                  className="w-full px-2 py-1 rounded-md bg-transparent border border-white/10 text-sm"
                />
              </div>

              <div className="md:col-span-6 mt-2">
                <label className="text-xs text-white/60">Notes</label>
                <input
                  value={c.notes}
                  onChange={(e) =>
                    setCompatList((s) =>
                      s.map((x, i) =>
                        i === idx ? { ...x, notes: e.target.value } : x
                      )
                    )
                  }
                  className="w-full px-2 py-1 rounded-md bg-transparent border border-white/10 text-sm"
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeCompat(idx)}
                    className="px-3 py-1 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-white text-black font-semibold"
        >
          {saving ? "Saving..." : editing ? "Save changes" : "Create product"}
        </button>
      </div>

      {notice && <div className="text-sm text-white/70">{notice}</div>}
    </form>
  );
}
