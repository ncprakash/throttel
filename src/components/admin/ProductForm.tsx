// components/admin/ProductForm.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

type Category = { category_id: string; name: string };

const SPEC_KEYS = [
  "diameter",
  "length",
  "torque_increase",
  "power_increase",
  "color",
  "finish",
];

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
    category_id: "",
    name: "",
    slug: "",
    short_description: "",
    description: "",
    regular_price: "",
    sale_price: "",
    sku: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
    warranty_months: 6,
    material: "",
    technical_specification: [],
    reviews: [],
    fitment_guide: "",
  });

  const [reviewList, setReviewList] = useState<
    { user: string; rating: number; comment: string }[]
  >([]);

  // Weight handling: value + unit (kg | g)
  const [weightValue, setWeightValue] = useState<string | number>("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");

  // Update form when product changes (for editing)
  useEffect(() => {
    if (product) {
      setForm({
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
        technical_specification: product?.technical_specification || [],
        reviews: product?.reviews || [],
        fitment_guide: product?.fitment_guide ?? "",
      });
      setReviewList(product?.reviews || []);
      if (product?.weight != null) {
        setWeightValue(product.weight);
        setWeightUnit("kg");
      } else {
        setWeightValue("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.product_id]);

  // images (local preview + file)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
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
  >([]);

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Update compatList when product changes
  useEffect(() => {
    if (product?.product_compatibility) {
      setCompatList(product.product_compatibility);
    } else {
      setCompatList([]);
    }
  }, [product?.product_id]);

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

  // Load existing images when product changes
  useEffect(() => {
    if (editing && product?.product_images) {
      setExistingImages(product.product_images || []);
      setImageFiles([]);
      setImagePreviews([]);
      setImagesToDelete([]);
    } else {
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
      setImagesToDelete([]);
    }
  }, [product?.product_id, editing]);

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
      console.log("🔄 Starting save...");
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
          weightKg = Math.round(weightKg * 100) / 100;
        }
      }

      const payload: any = {
        category_id: form.category_id || null,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description || null,
        short_description: form.short_description || null,
        technical_specification: Object.entries(specValues)
          .filter(([_, v]) => typeof v === 'string' && v.trim())
          .map(([key, value]) => ({ [key]: value })),
        reviews: reviewList.filter((r) => String(r.user).trim() && String(r.comment).trim()),
        regular_price: Number(form.regular_price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        sku: form.sku || null,
        stock_quantity: Number(form.stock_quantity || 0),
        is_active: Boolean(form.is_active),
        is_featured: Boolean(form.is_featured),
        weight: weightKg,
        warranty_months: form.warranty_months || 6,
        material: form.material || null,
        fitment_guide: form.fitment_guide || null,
      };

      let savedProd: any;

      // Create or Update Product
      if (editing && product.product_id) {
        console.log("📝 Editing product, sending PATCH...");
        console.log("Payload:", payload);
        const res = await axios.patch(
          `/api/admin/products/${product.product_id}`,
          payload
        );
        console.log("✅ PATCH Response:", res.data);
        savedProd = res.data.product || res.data[0] || res.data;
        console.log("📦 Saved product:", savedProd);

        // Delete removed images
        if (imagesToDelete.length > 0) {
          console.log("🖼️ Deleting images:", imagesToDelete);
          try {
            await axios.delete(
              `/api/admin/products/${product.product_id}/images`,
              {
                data: { image_ids: imagesToDelete },
              }
            );
            console.log("✅ Images deleted");
          } catch (err) {
            console.warn("❌ Failed to delete images:", err);
          }
        }

        // Clear existing compatibility and rebuild from form
        if (product.product_compatibility && product.product_compatibility.length > 0) {
          console.log("🔄 Clearing compatibility entries...");
          for (const compat of product.product_compatibility) {
            try {
              await axios.delete(
                `/api/admin/products/${product.product_id}/compatibility/${compat.compatibility_id}`
              );
            } catch (err) {
              console.warn("❌ Failed to delete compatibility:", err);
            }
          }
        }
      } else {
        console.log("🆕 Creating new product, sending POST...");
        const res = await axios.post(`/api/admin/products`, payload);
        console.log("✅ POST Response:", res.data);
        savedProd = res.data.product || res.data[0] || res.data;
        console.log("📦 Saved product:", savedProd);
      }

      if (!savedProd?.product_id) {
        throw new Error("Failed to get product ID from response");
      }

      console.log("✅ Product saved with ID:", savedProd.product_id);

      // Upload images using bulk endpoint
     if (imageFiles.length > 0 && savedProd?.product_id) {
  setUploadingImages(true);
  const formData = new FormData();

  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  console.log("📸 Files to upload:", imageFiles.length);
  imageFiles.forEach((f, i) =>
    console.log(`  File ${i}:`, f.name, f.type, f.size, "bytes")
  );

  try {
    console.log("🚀 Sending upload request to:", `/api/admin/products/${savedProd.product_id}/images/bulk`);
    
    const response = await axios.post(
      `/api/admin/products/${savedProd.product_id}/images/bulk`,
      formData
    );

    console.log("✅ Upload success! Status:", response.status);
    console.log("✅ Response data:", response.data);

  } catch (err: any) {  // ✅ typed as any so err.response works
    const responseData = err?.response?.data;
    console.error("❌ Upload FAILED");
    console.error("  Status:", err?.response?.status);
    console.error("  Error message:", responseData?.error || responseData?.message);
    console.error("  Error details:", responseData?.details);
    console.error("  Full response:", responseData);
    console.error("  Raw error:", err);
    setNotice(`Image upload failed: ${responseData?.error || responseData?.message || err?.message}`);
  } finally {
    setUploadingImages(false);
  }
}

      // Save compatibility entries
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
      console.log("✅ Save successful, notice set:", "Saved successfully");
      setImageFiles([]);
      setImagePreviews([]);
      setImagesToDelete([]);
      onSaved?.(savedProd);
    } catch (err: any) {
      console.error("❌ Save failed", err);
      const responseData = err?.response?.data;
      const errorMsg = responseData?.error || responseData?.message || err?.message || "Save failed";
      console.log("Setting error notice:", errorMsg, "response data:", responseData);
      setNotice(errorMsg);
    } finally {
      setSaving(false);
      setTimeout(() => {
        console.log("Clearing notice after 5 seconds");
        setNotice(null);
      }, 5000);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const totalImages = imageFiles.length + arr.length;

    if (totalImages > 8) {
      toast("You can only upload up to 8 images");
      return;
    }

    setImageFiles((prev) => [...prev, ...arr]);
  };

  const removePreviewAt = (idx: number) => {
    setImageFiles((s) => s.filter((_, i) => i !== idx));
    setImagePreviews((s) => s.filter((_, i) => i !== idx));
  };

  // If editing and product.weight exists, initialize properly
  useEffect(() => {
    if (editing && product?.weight != null) {
      setWeightValue(product.weight);
      setWeightUnit("kg");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const [specValues, setSpecValues] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    SPEC_KEYS.forEach((k) => {
      obj[k] = "";
    });
    return obj;
  });

  // Update specValues when product changes
  useEffect(() => {
    if (product?.technical_specification) {
      const existing = product.technical_specification;
      const obj: Record<string, string> = {};
      SPEC_KEYS.forEach((k) => {
        obj[k] = existing[k] ?? "";
      });
      setSpecValues(obj);
    } else {
      const obj: Record<string, string> = {};
      SPEC_KEYS.forEach((k) => {
        obj[k] = "";
      });
      setSpecValues(obj);
    }
  }, [product?.product_id]);

  return (
    <>
      {notice && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md p-4 rounded-md font-medium transition-all duration-300 ${
            notice.includes("failed") || notice.includes("error")
              ? "bg-red-500/20 text-red-300 border border-red-500/50"
              : "bg-green-500/20 text-green-300 border border-green-500/50"
          }`}
        >
          {notice.includes("failed") || notice.includes("error") ? "❌ " : "✅ "}
          {notice}
        </div>
      )}
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

          <label className="text-sm text-white/60">Fitment guide</label>
          <textarea
            value={form.fitment_guide}
            onChange={(e) => setField("fitment_guide", e.target.value)}
            rows={4}
            placeholder=""
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
          />

          <label className="text-sm text-white/60">Reviews</label>

          <div className="space-y-3">
            {reviewList.map((r, idx) => (
              <div
                key={idx}
                className="p-3 rounded-md border border-white/10 space-y-2"
              >
                <input
                  placeholder="User"
                  value={r.user}
                  onChange={(e) =>
                    setReviewList((s) =>
                      s.map((x, i) =>
                        i === idx ? { ...x, user: e.target.value } : x
                      )
                    )
                  }
                  className="w-full px-2 py-1 bg-transparent border border-white/10 rounded"
                />

                <select
                  value={r.rating}
                  onChange={(e) =>
                    setReviewList((s) =>
                      s.map((x, i) =>
                        i === idx ? { ...x, rating: Number(e.target.value) } : x
                      )
                    )
                  }
                  className="w-full px-2 py-1 bg-transparent border border-white/10 rounded"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} ⭐
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Comment"
                  value={r.comment}
                  onChange={(e) =>
                    setReviewList((s) =>
                      s.map((x, i) =>
                        i === idx ? { ...x, comment: e.target.value } : x
                      )
                    )
                  }
                  rows={2}
                  className="w-full px-2 py-1 bg-transparent border border-white/10 rounded"
                />

                <button
                  type="button"
                  onClick={() =>
                    setReviewList((s) => s.filter((_, i) => i !== idx))
                  }
                  className="text-sm text-red-400"
                >
                  Remove review
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setReviewList((s) => [...s, { user: "", rating: 5, comment: "" }])
            }
            className="text-sm text-blue-400"
          >
            + Add review
          </button>
        </div>

        <aside className="space-y-3">
          <label className="text-sm text-white/60">Category</label>
          <select
            value={form.category_id}
            onChange={(e) => setField("category_id", e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
            disabled={loadingCategories}
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

          <label className="text-sm text-white/60">Specification</label>
          <div className="space-y-2">
            {SPEC_KEYS.map((key) => (
              <div key={key} className="grid grid-cols-2 gap-2 items-center">
                <div className="text-sm text-white/70 capitalize">
                  {key.replace(/_/g, " ")}
                </div>
                <input
                  value={specValues[key]}
                  onChange={(e) =>
                    setSpecValues((s) => ({ ...s, [key]: e.target.value }))
                  }
                  placeholder="Enter value"
                  className="px-3 py-2 rounded-md bg-transparent border border-white/10"
                />
              </div>
            ))}
          </div>

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
            disabled={uploadingImages || (existingImages.length + imageFiles.length) >= 8}
            className="px-4 py-2 rounded-md bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImages ? "Uploading..." : "Select images"}
          </button>
          <div className="text-sm text-white/60 self-center">
            You can upload up to 8 images. ({existingImages.length + imageFiles.length}/8)
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm text-white/70 mb-2">Existing Images</h4>
            <div className="grid grid-cols-4 gap-3">
              {existingImages
                .filter((img) => !imagesToDelete.includes(img.image_id))
                .map((img, i) => (
                  <div
                    key={img.image_id || i}
                    className="relative rounded-md overflow-hidden border border-white/10"
                  >
                    <Image
                      src={img.image_url}
                      width={200}
                      height={200}
                      alt={img.alt_text || `image-${i}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImagesToDelete((prev) => [
                          ...prev,
                          img.image_id,
                        ])
                      }
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white hover:bg-red-700"
                      title="Delete image"
                    >
                      ×
                    </button>
                    {img.is_primary && (
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
            </div>
            {imagesToDelete.length > 0 && (
              <div className="mt-2 text-sm text-red-400">
                {imagesToDelete.length} image(s) marked for deletion
              </div>
            )}
          </div>
        )}

        {/* New Images to Upload */}
        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm text-white/70 mb-2">New Images</h4>
            <div className="grid grid-cols-4 gap-3">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative rounded-md overflow-hidden border border-white/10"
                >
                  <Image
                    src={src}
                    width={200}
                    height={200}
                    alt={`preview-${i}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePreviewAt(i)}
                    className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-black/80"
                  >
                    ×
                  </button>
                  {existingImages.length === 0 && i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
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
            className="px-3 py-1 rounded-md bg-white/8 hover:bg-white/10"
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
                    className="px-3 py-1 rounded-md text-sm text-red-400 hover:text-red-300"
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
            className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving || uploadingImages}
          className="px-4 py-2 rounded-md bg-white text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? uploadingImages
              ? "Uploading images..."
              : "Saving..."
            : editing
            ? "Save changes"
            : "Create product"}
        </button>
      </div>
    </form>
    </>
  );
}
