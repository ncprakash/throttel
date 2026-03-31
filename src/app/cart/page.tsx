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

export type ShippingOption = "normal" | "superfast";

export const SHIPPING_OPTIONS: Record<
  ShippingOption,
  { label: string; description: string; price: number }
> = {
  normal: {
    label: "Normal Delivery",
    description: "5–7 business days",
    price: 80,
  },
  superfast: {
    label: "Superfast Delivery",
    description: "1–2 business days",
    price: 150,
  },
};

export const TAX_RATE = 0.18; // 18% GST

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
    // Restore previously selected shipping option
    const saved = localStorage.getItem(
      "shippingOption",
    ) as ShippingOption | null;
    if (saved && SHIPPING_OPTIONS[saved]) setSelectedShipping(saved);
  }, []);

  const handleShippingChange = (option: ShippingOption) => {
    setSelectedShipping(option);
    localStorage.setItem("shippingOption", option);
  };

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
        item.cart_item_id === itemId ? { ...item, quantity } : item,
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
        (item) => item.cart_item_id !== itemId,
      );
      setCartItems(filteredItems);
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

  const shipping = SHIPPING_OPTIONS[selectedShipping].price;
  const tax = Math.round(subtotal * TAX_RATE);
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
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-white/60"
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
                    Delivery Method
                  </h3>

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
                          className={`relative flex flex-col gap-1 p-4 rounded-xl border text-left transition-all duration-200
                            ${
                              isSelected
                                ? "border-white bg-white/10 shadow-lg shadow-white/5"
                                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                            }`}
                        >
                          {/* Radio indicator */}
                          <span
                            className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                              ${
                                isSelected
                                  ? "border-white bg-white"
                                  : "border-white/30"
                              }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-black" />
                            )}
                          </span>

                          <span className="text-sm font-semibold text-white pr-6">
                            {option.label}
                          </span>
                          <span className="text-xs text-white/50">
                            {option.description}
                          </span>
                          <span
                            className={`text-sm font-bold mt-1 ${
                              isSelected ? "text-white" : "text-white/70"
                            }`}
                          >
                            ₹{option.price}
                          </span>

                          {key === "superfast" && (
                            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Fastest
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
                <div className="lg:sticky lg:top-8 lg:self-start z-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <CartSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    shippingLabel={SHIPPING_OPTIONS[selectedShipping].label}
                    tax={tax}
                    total={total}
                    itemCount={cartItems.length}
                  />

                  <div className="mt-6 flex flex-col gap-3">
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
