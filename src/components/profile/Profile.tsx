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

type Order = {
  order_id: string;
  created_at: string;
  order_number?: string;
  status?: string;
  total_amount?: number;
  payment_status?: string;
};

type WishlistItem = {
  wishlist_id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products: {
    product_id: string;
    name: string;
    description: string;
    regular_price: number;
    sale_price: number;
    stock_quantity: number;
    product_images: Array<{
      image_url: string;
      alt_text: string;
      is_primary: boolean;
    }>;
  };
};

type Address = {
  address_id: string;
  is_default: boolean;
};

export default function ProfilePage() {
  const { data: session } = useSession();

  const [user, setUser] = useState<User>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
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

    const fetchData = async () => {
      if (!session?.user?.id) {
        if (mounted) setLoading(false);
        return;
      }

      const userId = session.user.id.trim();
      setLoading(true);
      setNotice(null);

      const requests = {
        orders: axios.get(`/api/orders/${userId}`),
        wishlist: axios.get(`/api/wishlist?user_id=${userId}`),
        addresses: axios.get(`/api/addresses?user_id=${userId}`),
        userData: axios.get(`/api/users/${userId}`),
      };

      try {
        const entries = Object.entries(requests);
        const results = await Promise.allSettled(Object.values(requests));

        if (!mounted) return;

        const mapped: Record<string, any> = {};
        const errors: string[] = [];

        results.forEach((result, idx) => {
          const key = entries[idx][0];
          if (result.status === "fulfilled") {
            const responseData = result.value?.data ?? result.value ?? null;
            mapped[key] = responseData;
          } else {
            const err = result.reason;
            errors.push(`${key}: ${err?.message || "network error"}`);
            mapped[key] = null;
          }
        });

        // Set user data
        const userData = mapped.userData ?? null;
        setUser(userData);
        setForm({
          first_name: userData?.first_name || "",
          last_name: userData?.last_name || "",
          phone: userData?.phone || "",
        });

        // Handle orders response which may be single order object or array
        const rawOrders = mapped.orders ?? null;
        let ordersData: Order[] = [];

        if (
          rawOrders &&
          typeof rawOrders === "object" &&
          !Array.isArray(rawOrders) &&
          rawOrders.order_id
        ) {
          // Single order object
          ordersData = [rawOrders];
        } else if (Array.isArray(rawOrders)) {
          ordersData = rawOrders;
        } else if (rawOrders?.orders && Array.isArray(rawOrders.orders)) {
          ordersData = rawOrders.orders;
        }

        // Filter and sort valid orders
        const validOrders = ordersData.filter(
          (item): item is Order =>
            !!item &&
            typeof item === "object" &&
            // ensure these checks return boolean (not the raw string)
            !!(item as any).order_id &&
            !!(item as any).created_at
        );

        setOrders(
          validOrders.sort((a: Order, b: Order) =>
            b.created_at.localeCompare(a.created_at)
          )
        );

        // Wishlist items
        const rawWishlist = mapped.wishlist ?? null;
        const wishlistData = Array.isArray(rawWishlist?.wishlist)
          ? rawWishlist.wishlist
          : [];
        setWishlistItems(wishlistData);

        // Addresses
        const rawAddresses = mapped.addresses ?? null;
        const addressesData = Array.isArray(rawAddresses) ? rawAddresses : [];
        setAddresses(
          addressesData.filter((addr): addr is Address => !!addr?.address_id)
        );

        if (errors.length > 0) {
          setNotice(`Some data failed: ${errors.join(", ")}`);
          console.warn("Profile data load errors:", errors);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (mounted) {
          setNotice("Failed to load profile data");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [session]);

  async function saveProfile() {
    if (!session?.user?.id) return;

    setSaving(true);
    setNotice(null);

    try {
      const payload = { ...form };
      await axios.patch(`/api/users/${session.user.id}`, payload);
      setUser((prev) => (prev ? { ...prev, ...payload } : prev));
      setEditing(false);
      setNotice("Profile updated successfully!");
      console.log("Profile saved:", payload);
    } catch (err: any) {
      console.error("Save failed:", err);
      setNotice(err?.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 3000);
    }
  }

  const handleRemove = async (wishlist_id: string) => {
    if (!confirm("Remove this item from wishlist?")) return;

    try {
      await axios.delete(`/api/wishlist/${wishlist_id}`);
      setWishlistItems((prev) =>
        prev.filter((item) => item.wishlist_id !== wishlist_id)
      );
      setNotice("Removed from wishlist!");
    } catch (error) {
      console.error("Remove failed:", error);
      setNotice("Failed to remove from wishlist");
    } finally {
      setTimeout(() => setNotice(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <div className="glass-panel p-12 rounded-3xl shadow-2xl text-center max-w-md">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl font-semibold text-white">Loading profile...</p>
          <p className="text-white/60 mt-2">
            Fetching your orders and wishlist
          </p>
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
            <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-300">
              <div className="glass-panel px-6 py-3 rounded-xl shadow-2xl border border-white/10">
                <p className="text-sm text-white">{notice}</p>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
            <ProfileHeader onEdit={() => setEditing(!editing)} />
            {editing && (
              <div className="mt-8 pt-6 border-t border-white/10">
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {orders.length}
                  </p>
                  <p className="text-white/60 mt-2 font-medium">Total Orders</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <svg
                    className="w-8 h-8 text-orange-300"
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

            <div className="glass-panel p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {wishlistItems.length}
                  </p>
                  <p className="text-white/60 mt-2 font-medium">Wishlist</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <svg
                    className="w-8 h-8 text-pink-300"
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
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    Recent Orders
                  </h2>
                  <button className="text-lg font-semibold text-white/70 hover:text-white transition-all">
                    View All
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-white/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No orders yet
                    </h3>
                    <p className="text-white/50 max-w-md mx-auto">
                      Your motorcycle accessories orders will appear here once
                      you make your first purchase
                    </p>
                  </div>
                ) : (
                  <OrdersList orders={orders} onOpen={() => {}} compact />
                )}
              </div>
            </div>

            {/* Wishlist */}
            <div className="lg:col-span-1">
              <div className="glass-panel sticky top-6 p-6 rounded-3xl shadow-2xl">
                <WishlistCard
                  items={wishlistItems}
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
