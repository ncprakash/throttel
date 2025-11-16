// components/admin/UsersList.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

type User = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
  created_at?: string;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(
    async (opts?: { page?: number; q?: string }) => {
      setLoading(true);
      try {
        const p = opts?.page ?? page;
        const q = opts?.q ?? search;
        const res = await axios.get("/api/admin/users", {
          params: { page: p, limit, search: q },
        });
        setUsers(res.data.users || res.data || []);
        setTotal(res.data.total ?? res.data.users?.length ?? 0);
        setPage(p);
      } catch (err) {
        console.error("Could not load users", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [page, search, limit]
  );

  useEffect(() => {
    load({ page: 1, q: "" });
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load({ page: 1, q: search }), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  const toggleActive = async (id: string, current: boolean | undefined) => {
    try {
      await axios.patch(`/api/admin/users/${id}`, { is_active: !current });
      setNotice("Updated");
      load();
    } catch (err) {
      console.error("Toggle active failed", err);
      setNotice("Could not update user");
    } finally {
      setTimeout(() => setNotice(null), 1800);
    }
  };

  const removeUser = async (id: string) => {
    if (!confirm("Delete user? This action cannot be undone.")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setNotice("Deleted");
      load();
    } catch (err) {
      console.error("Delete failed", err);
      setNotice("Could not delete");
    } finally {
      setTimeout(() => setNotice(null), 1800);
    }
  };

  const handlePage = (dir: "next" | "prev") => {
    const next = dir === "next" ? page + 1 : Math.max(1, page - 1);
    load({ page: next });
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-sm text-white/60">{total} users</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-sm w-64"
            />
            <button
              onClick={() => load({ page: 1, q: search })}
              className="px-3 py-2 rounded-md bg-white text-black"
            >
              Search
            </button>
          </div>
        </div>

        {notice && <div className="mt-3 text-sm text-white/70">{notice}</div>}

        <div className="mt-4">
          {loading ? (
            <div className="text-white/60 py-8 text-center">Loading…</div>
          ) : users.length === 0 ? (
            <div className="text-white/60 py-8 text-center">No users found</div>
          ) : (
            <div className="grid gap-3">
              {users.map((u) => (
                <div
                  key={u.user_id}
                  className="p-3 rounded-md bg-white/3 border border-white/6 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white/6 grid place-items-center text-sm font-medium">
                      {u.first_name?.[0] ?? "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {u.first_name} {u.last_name}
                      </div>
                      <div className="text-xs text-white/60 truncate">
                        {u.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-white/60 text-right">
                      <div>Joined</div>
                      <div className="font-medium">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => toggleActive(u.user_id, u.is_active)}
                        className={`px-3 py-1 rounded-md ${
                          u.is_active ? "bg-white text-black" : "bg-white/6"
                        }`}
                      >
                        {u.is_active ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(u.email || "")
                        }
                        className="px-3 py-1 rounded-md"
                      >
                        Copy
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() => removeUser(u.user_id)}
                        className="px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-white/60">Page {page}</div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePage("prev")}
              className="px-3 py-1 rounded-md"
            >
              Prev
            </button>
            <button
              onClick={() => handlePage("next")}
              className="px-3 py-1 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
