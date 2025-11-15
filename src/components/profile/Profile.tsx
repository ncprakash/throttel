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

      const requests = {
        user: axios.get("/api/user"),
        orders: axios.get("/api/orders"),
        wishlist: axios.get("/api/wishlist"),
        addresses: axios.get("/api/addresses"),
      };

      try {
        const entries = Object.entries(requests);
        const results = await Promise.allSettled(Object.values(requests));

        if (!mounted) return;

        const mapped: Record<string, any> = {};
        const errors: string[] = [];

        results.forEach((r, idx) => {
          const key = entries[idx][0];
          if (r.status === "fulfilled") {
            mapped[key] = r.value.data;
          } else {
            const err = r.reason;
            const status = err?.response?.status;
            const url = err?.config?.url;
            errors.push(`${key} (${url}) -> ${status ?? "network error"}`);
            mapped[key] = null;
          }
        });

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
          setNotice(`Some data failed to load: ${errors.join(", ")}`);
          console.warn("Profile data load errors:", errors);
        }
      } catch (err) {
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
      setNotice("Profile updated successfully");
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
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="backdrop-blur-xl bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                borderTopColor: "var(--foreground)",
              }}
              aria-hidden
            />
            <p className="text-[var(--muted)] text-sm">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
        {/* Background Decorative Elements — subtle monochrome blobs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background: "color:var(--foreground) / 0.02" as any,
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background: "color:var(--foreground) / 0.02" as any,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Notification Toast */}
          {notice && (
            <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5">
              <div className="backdrop-blur-xl bg-[color:var(--foreground)_/0.06] border border-[var(--border)] rounded-xl px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <p className="text-sm text-[var(--foreground)]">{notice}</p>
              </div>
            </div>
          )}

          {/* Profile Header Section */}
          <div className="backdrop-blur-xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <ProfileHeader onEdit={() => setEditing(!editing)} />

            {editing && (
              <div
                className="mt-6 pt-6 border-t"
                style={{ borderColor: "var(--border)" }}
              >
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
            )}
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="backdrop-blur-xl bg-[color:var(--foreground)_/0.03] border border-[var(--border)] rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[var(--foreground)]">
                    {orders.length}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Total Orders
                  </p>
                </div>
                <div className="w-12 h-12 bg-[color:var(--foreground)_/0.04] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-[color:var(--foreground)_/0.03] border border-[var(--border)] rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[var(--foreground)]">
                    {wishlist.length}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Wishlist Items
                  </p>
                </div>
                <div className="w-12 h-12 bg-[color:var(--foreground)_/0.04] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-[color:var(--foreground)_/0.03] border border-[var(--border)] rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[var(--foreground)]">
                    {addresses.length}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Saved Addresses
                  </p>
                </div>
                <div className="w-12 h-12 bg-[color:var(--foreground)_/0.04] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Orders (Spans 2 columns on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="backdrop-blur-xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    Recent Orders
                  </h3>
                  <button className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    View All
                  </button>
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[color:var(--foreground)_/0.03] border border-[var(--border)] flex items-center justify-center">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-[var(--muted)]">No orders yet</p>
                    <p className="text-sm text-[color:var(--muted)_/0.75] mt-1">
                      Your order history will appear here
                    </p>
                  </div>
                ) : (
                  <OrdersList orders={orders} onOpen={() => {}} compact />
                )}
              </div>

              {/* Addresses Section */}
              <div className="backdrop-blur-xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    Delivery Addresses
                  </h3>
                  <button
                    onClick={() => addOrUpdateAddress({ mock: true })}
                    className="backdrop-blur-md bg-[color:var(--foreground)_/0.04] hover:bg-[color:var(--foreground)_/0.06] border border-[var(--border)] px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-105"
                  >
                    + Add New
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[color:var(--foreground)_/0.03] border border-[var(--border)] flex items-center justify-center">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-[var(--muted)]">No addresses saved</p>
                    <p className="text-sm text-[color:var(--muted)_/0.75] mt-1">
                      Add a delivery address to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr: any) => (
                      <div
                        key={addr.address_id}
                        className="backdrop-blur-md bg-[color:var(--foreground)_/0.03] border border-[var(--border)] rounded-xl p-5 hover:bg-[color:var(--foreground)_/0.05] transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-[var(--foreground)]">
                                {addr.name || addr.line1}
                              </p>
                              {addr.is_default && (
                                <span
                                  className="text-xs px-2 py-1 rounded-full border"
                                  style={{
                                    background:
                                      "color:var(--foreground) / 0.04",
                                    color: "var(--muted)",
                                    borderColor: "var(--border)",
                                  }}
                                >
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--muted)]">
                              {addr.city}, {addr.postcode}
                            </p>
                          </div>
                          {!addr.is_default && (
                            <button
                              onClick={() => setDefaultAddress(addr.address_id)}
                              className="text-xs backdrop-blur-sm bg-[color:var(--foreground)_/0.04] hover:bg-[color:var(--foreground)_/0.06] px-3 py-1.5 rounded-lg border border-[var(--border)] transition-all duration-300 opacity-0 group-hover:opacity-100"
                            >
                              Set Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Wishlist */}
            <div className="lg:col-span-1">
              <WishlistCard
                items={wishlist}
                onRemove={removeFromWishlist}
                compact
              />
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
