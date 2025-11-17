"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";
import EditProfileForm from "./EditProfileForm";
import OrdersList from "./OrdersList";
import WishlistCard from "./WishlistCard";
import BottomNav from "../BottomNavbar";
import { useSession } from "next-auth/react";

type User = {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
} | null;

export default function ProfilePage() {
  const { data: session } = useSession();
console.log(session?.user.id);

  const [user, setUser] = useState<User>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]); // ✅ Fixed: Initialize as array
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

      // ✅ Fixed: Check if session exists before making requests
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const requests = {
        user: axios.get("/api/user"),
        orders: axios.get("/api/orders"),
        wishlist: axios.get(`/api/wishlist?user_id=${session.user.id.trim()}`), // ✅ Fixed: Added trim()
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

        // ✅ Fixed: Extract wishlist array from response
        setWishlistItems(mapped.wishlist?.wishlist || []);
        
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
  }, [session]); // ✅ Fixed: Added session as dependency

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

  // ✅ Fixed: Moved handleRemove before the loading check
  const handleRemove = async (wishlist_id: string) => {
    if (!confirm("Remove this item from wishlist?")) return;

    try {
      await axios.delete(`/api/wishlist/${wishlist_id}`);

      // Remove from state
      setWishlistItems((prev) =>
        prev.filter((item) => item.wishlist_id !== wishlist_id)
      );

      setNotice("Removed from wishlist!");
      setTimeout(() => setNotice(null), 1500);
    } catch (error) {
      console.error("Failed to remove:", error);
      setNotice("Failed to remove from wishlist");
      setTimeout(() => setNotice(null), 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white text-sm">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-transparent text-white pb-32 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Notification Toast */}
          {notice && (
            <div className="fixed top-6 right-6 z-50">
              <div className="glass-panel px-6 py-3 rounded-xl shadow">
                <p className="text-sm text-white">{notice}</p>
              </div>
            </div>
          )}

          {/* Profile Header Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl transition-shadow duration-300">
            <ProfileHeader onEdit={() => setEditing(!editing)} />

            {editing && (
              <div className="mt-6 pt-6 border-t border-white/8">
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
            <div className="glass-panel p-6 rounded-2xl transform-gpu transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {orders.length}
                  </p>
                  <p className="text-sm text-white/60 mt-1">Total Orders</p>
                </div>
                <div className="w-12 h-12 bg-white/6 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

            <div className="glass-panel p-6 rounded-2xl transform-gpu transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {wishlistItems.length} {/* ✅ Fixed: Use wishlistItems */}
                  </p>
                  <p className="text-sm text-white/60 mt-1">Wishlist Items</p>
                </div>
                <div className="w-12 h-12 bg-white/6 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

            <div className="glass-panel p-6 rounded-2xl transform-gpu transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {addresses.length}
                  </p>
                  <p className="text-sm text-white/60 mt-1">Saved Addresses</p>
                </div>
                <div className="w-12 h-12 bg-white/6 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Orders */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Recent Orders
                  </h3>
                  <button className="text-sm text-white/60 hover:text-white transition-colors">
                    View All
                  </button>
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/6 border border-white/10 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-white/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/60">No orders yet</p>
                    <p className="text-sm text-white/40 mt-1">
                      Your order history will appear here
                    </p>
                  </div>
                ) : (
                  <OrdersList orders={orders} onOpen={() => {}} compact />
                )}
              </div>

              {/* Addresses Section */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Delivery Addresses
                  </h3>
                  <button
                    onClick={() => addOrUpdateAddress({ mock: true })}
                    className="px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm bg-white/8 border border-white/12 hover:bg-white/12 transition"
                  >
                    + Add New
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/6 border border-white/10 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-white/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/60">No addresses saved</p>
                    <p className="text-sm text-white/40 mt-1">
                      Add a delivery address to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr: any) => (
                      <div
                        key={addr.address_id}
                        className="glass-panel p-5 rounded-xl hover:bg-white/12 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-white">
                                {addr.name || addr.line1}
                              </p>
                              {addr.is_default && (
                                <span className="text-xs bg-white/8 text-black px-2 py-1 rounded-full border border-white/10">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-white/60">
                              {addr.city}, {addr.postcode}
                            </p>
                          </div>
                          {!addr.is_default && (
                            <button
                              onClick={() => setDefaultAddress(addr.address_id)}
                              className="text-xs backdrop-blur-sm bg-white/8 hover:bg-white/12 px-3 py-1.5 rounded-lg border border-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
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
              <div className="glass-panel rounded-2xl p-6 shadow-xl">
                <WishlistCard
                  items={wishlistItems} // ✅ Pass the wishlist array
                  onRemove={handleRemove}
                  compact={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
