// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  // Fetch cart items from localStorage
  const fetchCartItems = () => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart from localStorage:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      // Keep your existing API call for recommended products
      const response = await fetch("/api/products/recommended");
      const data = await response.json();
      setRecommendedProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    try {
      const updatedItems = cartItems.map((item) =>
        item.cart_item_id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);
      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const filteredItems = cartItems.filter(
        (item) => item.cart_item_id !== itemId
      );
      setCartItems(filteredItems);
      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(filteredItems));
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

  const shipping = subtotal > 50 ? 80 : 80;
  
  const total = subtotal + shipping ;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
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
      <div className="min-h-screen bg-black text-white pb-32">
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
                <div className="lg:sticky lg:top-8 lg:self-start z-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <CartSummary
                    subtotal={subtotal}
                    shipping={shipping}
                  
                    total={total}
                    itemCount={cartItems.length}
                  />

                  <div className="mt-6 flex flex-col gap-3">
                    {/* Checkout */}
                    <button
                      onClick={() => router.push("/checkout")}
                      className="w-full px-4 py-3 rounded-lg text-sm font-semibold
                               backdrop-blur-md bg-white/10 border border-white/20
                               hover:bg-white/20 transition-all"
                    >
                      Proceed to Checkout
                    </button>

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
