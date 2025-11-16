// app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Throttel");
  const [supportEmail, setSupportEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    // load existing settings (if your API supports)
    async function load() {
      try {
        const res = await axios.get("/api/admin/settings");
        if (res.data) {
          setSiteName(res.data.siteName || "Throttel");
          setSupportEmail(res.data.supportEmail || "");
        }
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post("/api/admin/settings", { siteName, supportEmail });
      setNotice("Saved");
    } catch (err) {
      console.error(err);
      setNotice("Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 2000);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-white/60 mt-1">
        General site settings and configuration
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <label className="text-sm text-white/60">Site name</label>
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full px-3 py-2 rounded-md mt-2 bg-transparent border border-white/10"
          />

          <label className="text-sm text-white/60 mt-4">Support email</label>
          <input
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md mt-2 bg-transparent border border-white/10"
          />

          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-md bg-white text-black"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          {notice && <div className="mt-3 text-sm text-white/70">{notice}</div>}
        </div>
      </div>
    </div>
  );
}
