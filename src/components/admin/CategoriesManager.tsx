// components/admin/CategoriesManager.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaSync } from "react-icons/fa";

type Category = {
  category_id: string;
  name: string;
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/admin/categories");
      const payload = res.data.categories ?? res.data ?? [];
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

  async function createCategory() {
   
   
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/categories");
      const created = res.data.category ?? res.data;
      // optimistic update
      setCategories((s) => [created, ...s]);
      setNewName("");
    } catch (err) {
      console.error("Create failed", err);
      setError("Could not create category");
    } finally {
      setSaving(false);
      setTimeout(() => setError(null), 2500);
    }
  }

  async function removeCategory(id: string) {
    if (
      !confirm(
        "Delete this category? This will not remove products automatically."
      )
    )
      return;
    // optimistic UI: remove locally then call API
    const prev = categories;
    setCategories((s) => s.filter((c) => c.category_id !== id));
    try {
      await axios.delete(`/api/admin/categories/${id}`);
    } catch (err) {
      console.error("Delete failed", err);
      setCategories(prev);
      setError("Delete failed");
      setTimeout(() => setError(null), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Categories</h2>
          <p className="text-sm text-white/60">
            Create and remove product categories
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

      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex gap-2 items-center">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            className="flex-1 px-3 py-2 rounded-md bg-transparent border border-white/10"
            onKeyDown={(e) => {
              if (e.key === "Enter") createCategory();
            }}
          />
          <button
            onClick={createCategory}
            disabled={saving || !newName.trim()}
            className="px-4 py-2 rounded-md bg-white text-black flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}

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
                      id: {c.category_id.slice(0, 8)}
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
