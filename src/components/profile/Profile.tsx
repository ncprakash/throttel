"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import ProfileHeader from "./ProfileHeader";
import EditProfileForm from "./EditProfileForm";
import OrdersList from "./OrdersList";
import WishlistCard from "./WishlistCard";
import BottomNav from "../BottomNavbar";

type User = {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  // extend with other fields from your API as needed
} | null;

export default function ProfilePage() {
  const [user, setUser] = useState<User>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setNotice(null);

      // list of requests with friendly keys so we can report per-request failures
      const requests = {
        user: axios.get("/api/user"),
        orders: axios.get("/api/orders"),
        wishlist: axios.get("/api/wishlist"),
        addresses: axios.get("/api/addresses"),
      };

      try {
        // use allSettled so one 404 doesn't reject the entire batch
        const entries = Object.entries(requests);
        const results = await Promise.allSettled(Object.values(requests));

        if (!mounted) return;

        // map results back to keys
        const mapped: Record<string, any> = {};
        const errors: string[] = [];

        results.forEach((r, idx) => {
          const key = entries[idx][0]; // 'user' | 'orders' | ...
          if (r.status === "fulfilled") {
            mapped[key] = r.value.data;
          } else {
            // r.reason is likely an AxiosError
            const err = r.reason;
            const status = err?.response?.status;
            const url = err?.config?.url;
            errors.push(`${key} (${url}) -> ${status ?? "network error"}`);
            mapped[key] = null; // fallback
          }
        });

        // apply sensible fallbacks
        const userData = mapped.user ?? null;
        setUser(userData);
        setForm({
          first_name: userData?.first_name || "",
          last_name: userData?.last_name || "",
          phone: userData?.phone || "",
        });

        setOrders(
          (mapped.orders || [])?.sort?.((a: any, b: any) =>
            (b.created_at || "").localeCompare(a.created_at || "")
          ) ?? []
        );

        setWishlist(mapped.wishlist || []);
        setAddresses(mapped.addresses || []);

        if (errors.length) {
          // show something useful to the user / dev
          setNotice(`Some data failed to load: ${errors.join(", ")}`);
          console.warn("Profile data load errors:", errors);
        }
      } catch (err) {
        // This should rarely run because we used allSettled, but keep a fallback
        console.error("Unexpected error loading profile data", err);
        setNotice("Could not load remote data — demo UI only.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    setNotice(null);
    try {
      const payload = { ...form };
      await axios.put(`/api/user/${user.user_id}`, payload);
      setUser((s) => (s ? { ...s, ...payload } : s));
      setEditing(false);
      setNotice("Profile updated");
    } catch (err) {
      console.error(err);
      setNotice("Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 2000);
    }
  }

  async function removeFromWishlist(id: string) {
    const prev = [...wishlist];
    setWishlist((w) => w.filter((i) => i.wishlist_id !== id));
    try {
      await axios.delete(`/api/wishlist/${id}`);
      setNotice("Removed from wishlist");
    } catch (err) {
      console.error(err);
      setWishlist(prev);
      setNotice("Could not remove item");
    } finally {
      setTimeout(() => setNotice(null), 1500);
    }
  }

  async function setDefaultAddress(id: string) {
    const prev = [...addresses];
    setAddresses((arr) =>
      arr.map((a) => ({ ...a, is_default: a.address_id === id }))
    );
    try {
      await axios.patch(`/api/addresses/${id}/default`);
      setNotice("Default address set");
    } catch (err) {
      console.error(err);
      setAddresses(prev);
      setNotice("Could not set default");
    } finally {
      setTimeout(() => setNotice(null), 1500);
    }
  }

  async function addOrUpdateAddress(payload: any) {
    setNotice(null);
    try {
      const res = await axios.post(`/api/addresses`, payload);
      setAddresses((prev) => [res.data, ...prev]);
      setNotice("Address saved");
    } catch (err) {
      console.error(err);
      setNotice("Could not save address");
    } finally {
      setTimeout(() => setNotice(null), 1500);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center text-white/80">Loading profile…</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black to-black p-6 sm:p-10 mb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/4 rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <ProfileHeader user={user} onEdit={() => setEditing(true)} />
                <div>
                  <div className="text-lg font-semibold">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-sm text-white/60">{user?.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded-2xl bg-white/10 text-sm"
                  onClick={() => setEditing((v) => !v)}
                >
                  {editing ? "Close" : "Edit profile"}
                </button>
                <button className="px-4 py-2 rounded-2xl bg-transparent border text-sm">
                  Logout
                </button>
              </div>
            </div>

            {notice && (
              <div className="mt-4 text-sm text-yellow-300">{notice}</div>
            )}

            <div className="mt-6">
              <EditProfileForm
                open={editing}
                user={user}
                value={form}
                setValue={setForm}
                onSave={saveProfile}
                onClose={() => setEditing(false)}
                saving={saving}
              />
            </div>
          </div>

          {/* ---------- GRID LAYOUT: two columns on lg, single on mobile ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: Recent orders + Addresses */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Recent orders</h3>
                <OrdersList orders={orders} onOpen={() => {}} compact />
              </div>

              <div className="bg-white/5 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Addresses</h3>
                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <div className="text-sm text-white/60">
                      No addresses yet — add one from the button.
                    </div>
                  ) : (
                    addresses.map((addr: any) => (
                      <div
                        key={addr.address_id}
                        className="flex items-start justify-between p-3 bg-white/4 rounded"
                      >
                        <div className="text-sm">
                          <div className="font-medium">
                            {addr.name || addr.line1}
                          </div>
                          <div className="text-xs text-white/60">
                            {addr.city}, {addr.postcode}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {addr.is_default && (
                            <div className="text-xs text-white/70">Default</div>
                          )}
                          <button
                            className="text-xs px-3 py-1 rounded bg-white/6"
                            onClick={() => setDefaultAddress(addr.address_id)}
                          >
                            Set default
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="px-4 py-2 rounded-2xl bg-white/10 text-sm"
                    onClick={() => addOrUpdateAddress({ mock: true })}
                  >
                    Add address
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Wishlist + Quick stats */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Wishlist</h3>
                <WishlistCard
                  items={wishlist}
                  onRemove={removeFromWishlist}
                  compact
                />
              </div>

              <div className="bg-white/5 rounded-2xl p-5 shadow-sm text-center">
                <h3 className="text-lg font-semibold mb-2">Quick stats</h3>
                <div className="grid grid-cols-3 gap-3 text-xs text-white/60">
                  <div className="p-3 rounded bg-white/4">
                    <div className="text-xl font-semibold">{orders.length}</div>
                    <div>Orders</div>
                  </div>
                  <div className="p-3 rounded bg-white/4">
                    <div className="text-xl font-semibold">
                      {wishlist.length}
                    </div>
                    <div>Wishlist</div>
                  </div>
                  <div className="p-3 rounded bg-white/4">
                    <div className="text-xl font-semibold">
                      {addresses.length}
                    </div>
                    <div>Addresses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* --------------------------------------------------------------------- */}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
