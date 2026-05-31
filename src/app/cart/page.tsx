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

import { SHIPPING_OPTIONS, TAX_RATE, type ShippingOption } from "@/lib/commerce";
export type { ShippingOption };
export { SHIPPING_OPTIONS, TAX_RATE };

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption>("normal");

  useEffect(() => {
    fetchCartItems();
    fetchRecommendedProducts();
    const saved = localStorage.getItem(
      "shippingOption"
    ) as ShippingOption | null;
    if (saved && SHIPPING_OPTIONS[saved]) setSelectedShipping(saved);
  }, []);

  const handleShippingChange = (option: ShippingOption) => {
    setSelectedShipping(option);
    localStorage.setItem("shippingOption", option);
  };

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
      localStorage.setItem("cartItems", JSON.stringify(filteredItems));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.sale_price ?? item.product?.regular_price ?? 0;
    const variantPrice = item.variant?.additional_price || 0;
    return sum + (price + variantPrice) * item.quantity;
  }, 0);

  const shipping = SHIPPING_OPTIONS[selectedShipping].price;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase">
            Loading cart
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-transparent text-white pb-32">
        {/* Page header */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-3">
              Your selection
            </p>
            <div className="flex items-end gap-6">
              <h1 className="text-5xl sm:text-7xl font-black tracking-[-0.04em] leading-none uppercase">
                Cart
              </h1>
              <span className="text-xl text-white/30 mb-2">
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {cartItems.length === 0 ? (
            <>
              <EmptyCart />
              {recommendedProducts.length > 0 && (
                <div className="mt-10">
                  <RecommendedProducts products={recommendedProducts} />
                </div>
              )}
            </>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Cart Items + Shipping Selector */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cart_item_id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}

                {/* Shipping Selector */}
                <div className="border border-white/8 rounded-2xl p-6 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-5">
                    <svg
                      className="w-4 h-4 text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12l1-12"
                      />
                    </svg>
                    <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
                      Delivery method
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {(
                      Object.entries(SHIPPING_OPTIONS) as [
                        ShippingOption,
                        (typeof SHIPPING_OPTIONS)[ShippingOption],
                      ][]
                    ).map(([key, option]) => {
                      const isSelected = selectedShipping === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleShippingChange(key)}
                          className={`relative flex flex-col gap-1.5 p-5 rounded-xl border text-left transition-all duration-200
                            ${
                              isSelected
                                ? "border-white bg-white/8 shadow-lg shadow-white/5"
                                : "border-white/8 bg-white/[0.02] hover:border-white/15"
                            }`}
                        >
                          {/* Radio indicator */}
                          <span
                            className={`absolute top-4 right-4 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all
                              ${
                                isSelected
                                  ? "border-white bg-white"
                                  : "border-white/25"
                              }`}
                          >
                            {isSelected && (
                              <span className="w-1 h-1 rounded-full bg-black" />
                            )}
                          </span>

                          <span className="text-sm font-bold text-white pr-6">
                            {option.label}
                          </span>
                          <span className="text-xs text-white/40">
                            {option.description}
                          </span>
                          <span
                            className={`text-base font-black mt-1 ${
                              isSelected ? "text-white" : "text-white/60"
                            }`}
                          >
                            ₹{option.price}
                          </span>

                          {key === "superfast" && (
                            <span className="mt-1 text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400">
                              ⚡ Fastest
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-8 lg:self-start z-20 border border-white/8 rounded-2xl p-6 bg-white/[0.02] backdrop-blur-xl">
                  <CartSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    shippingLabel={SHIPPING_OPTIONS[selectedShipping].label}
                    tax={tax}
                    total={total}
                    itemCount={cartItems.length}
                  />

                  <div className="mt-6">
                    <button
                      onClick={() => router.push("/shop")}
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-white/8
                               hover:bg-white/5 transition-colors text-white/70 hover:text-white"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {cartItems.length > 0 && recommendedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/5">
              <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6">
                You might also like
              </p>
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
