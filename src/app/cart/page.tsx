// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import EmptyCart from "@/components/Cart/EmptyCart";
import RecommendedProducts from "@/components/Cart/RecommededProduct";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";
import BottomNav from "@/components/BottomNavbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchCartItems();
    fetchRecommendedProducts();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const response = await axios.get("/api/products/recommended");
      setRecommendedProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await axios.patch(`/api/cart/${itemId}`, { quantity });
      setCartItems((items) =>
        items.map((item) =>
          item.cart_item_id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/cart/${itemId}`);
      setCartItems((items) =>
        items.filter((item) => item.cart_item_id !== itemId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.sale_price ?? item.product?.regular_price ?? 0;
    const variantPrice = item.variant?.additional_price || 0;
    return sum + (price + variantPrice) * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-transparent text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Shopping Cart
            </h1>
            <p className="text-white/60">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <>
              <EmptyCart />

              {recommendedProducts.length > 0 && (
                <div className="mt-8">
                  <RecommendedProducts products={recommendedProducts} />
                </div>
              )}
            </>
          ) : (
            // ensure both columns align to the top so the right column remains stable
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cart_item_id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                {/* make this wrapper sticky only on large screens and anchor it to the start */}
                <div className="lg:sticky lg:top-8 lg:self-start z-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <CartSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    total={total}
                    itemCount={cartItems.length}
                  />

                  <div className="mt-6 flex flex-col gap-3">
                    {/* removed duplicate Proceed to Checkout here (kept inside CartSummary) */}

                    {/* Continue shopping */}
                    <button
                      onClick={() => router.push("/shop")}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium
                               backdrop-blur-md bg-black/50 border border-white/10
                               hover:bg-white/5 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {cartItems.length > 0 && recommendedProducts.length > 0 && (
            <div className="mt-10">
              <RecommendedProducts products={recommendedProducts} />
            </div>
          )}
        </div>
      </div>
      <BottomNav />
      <Footer />
    </>
  );
}
