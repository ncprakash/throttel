"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaSync } from "react-icons/fa";

type Category = {
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at?: string;
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/admin/categories");
      const payload: Category[] = res.data.categories ?? res.data ?? [];
      setCategories(payload);
    } catch (err) {
      console.error("Failed to load categories", err);
      setError("Could not load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createCategory(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName || !trimmedSlug) {
      setError("Name and slug are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await axios.post("/api/admin/categories", {
        name: trimmedName,
        slug: trimmedSlug,
        description: description.trim() || null,
        is_active: isActive,
      });

      const created: Category = res.data.category ?? res.data;
      setCategories((prev) => [created, ...prev]);

      // reset form
      setName("");
      setSlug("");
      setDescription("");
      setIsActive(true);
    } catch (err) {
      console.error("Create failed", err);
      setError("Could not create category");
    } finally {
      setSaving(false);
      setTimeout(() => setError(null), 2500);
    }
  }

  async function removeCategory(id: string) {
  if (!confirm("Delete this category? This will not remove products automatically.")) {
    return;
  }

  setError(null); // Clear previous errors
  const prev = [...categories]; // Copy for rollback

  try {
    // Optimistic update
    setCategories((s) => s.filter((c) => c.category_id !== id));
    
    const res = await axios.delete(`/api/admin/categories/${id}`);
    
    if (res.data.error) {
      throw new Error(res.data.error);
    }
    
    console.log("✅ Deleted:", res.data);
  } catch (err: any) {
    console.error("Delete failed:", err);
    
    // Rollback optimistic update
    setCategories(prev);
    
    // Show specific error message
    const errorMsg = err.response?.data?.error || err.message || "Delete failed";
    setError(errorMsg);
    
    setTimeout(() => setError(null), 5000);
  }
}


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Categories</h2>
          <p className="text-sm text-white/60">
            Create and manage product categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="px-3 py-2 rounded-md backdrop-blur-sm bg-white/8"
          >
            <FaSync />
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4">
        {/* FORM */}
        <form onSubmit={createCategory} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Name *
              </label>
              <input
                value={name}
                onChange={(e) => {
                  const v = e.target.value;
                  setName(v);
                  setSlug(slugify(v)); // auto-generate slug from name
                }}
                placeholder="Category name"
                className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">
                Slug *
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="category-slug"
                className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10 min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              Active
            </label>

            <button
              type="submit"
              disabled={saving || !name.trim() || !slug.trim()}
              className="px-4 py-2 rounded-md bg-white text-black flex items-center gap-2 disabled:opacity-60"
            >
              <FaPlus />
              {saving ? "Saving..." : "Add Category"}
            </button>
          </div>
        </form>

        {error && <div className="mt-1 text-sm text-rose-400">{error}</div>}

        {/* LIST */}
        <div className="mt-4">
          {loading ? (
            <div className="text-white/60 py-6 text-center">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="text-white/60 py-6 text-center">
              No categories yet
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((c) => (
                <div
                  key={c.category_id}
                  className="flex items-center justify-between p-3 rounded-md bg-white/3 border border-white/6"
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-white/60">
                      slug: {c.slug}
                    </div>
                    <div className="text-xs text-white/40">
                      id: {c.category_id.slice(0, 8)} ·{" "}
                      {c.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeCategory(c.category_id)}
                      className="px-3 py-1 rounded-md text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
