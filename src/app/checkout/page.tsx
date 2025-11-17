// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // ✅ Import useSession
import axios from "axios";

import CheckoutForm from "@/components/Checkout/CheckoutForm";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import OrderReview from "@/components/Checkout/OrderReview";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ Get session
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Form values state
  const [formValues, setFormValues] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "India",
  });

  // ✅ Check authentication
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    
    if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    // Pre-fill form with user data from session
    if (session?.user) {
      setFormValues((prev) => ({
        ...prev,
        customer_name: session.user.name || prev.customer_name,
        customer_email: session.user.email || prev.customer_email,
      }));
    }
  }, [session, status, router]);

  useEffect(() => {
    // Load cart from localStorage
    const loadCartFromLocalStorage = () => {
      try {
        const storedCart = localStorage.getItem("cartItems");
        
        console.log("=== Loading Cart for Checkout ===");
        console.log("Raw localStorage value:", storedCart);
        
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          console.log("Parsed cart:", parsedCart);
          setCartItems(parsedCart || []);
        } else {
          console.log("No cart found in localStorage");
          setCartItems([]);
        }
      } catch (e) {
        console.error("Failed to load cart from localStorage:", e);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartFromLocalStorage();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((s, it) => {
    const price = it.product?.sale_price ?? it.product?.regular_price ?? 0;
    const variant = it.variant?.additional_price || 0;
    return s + (price + variant) * it.quantity;
  }, 0);

  const shipping = shippingMethod === "express" ? 80 : subtotal > 50 ? 80 : 80;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (paymentMethod: string) => {
    // Validate form
    if (!formValues.customer_name || !formValues.customer_email) {
      alert("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      router.push("/cart");
      return;
    }

    // ✅ Check if user is authenticated
    if (!session?.user) {
      alert("Please login to place an order");
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    setPlacingOrder(true);

    try {
      console.log("=== Placing Order ===");
      console.log("Session user:", session.user);
      console.log("Form values:", formValues);
      console.log("Cart items:", cartItems);
      console.log("Payment method:", paymentMethod);

      // ✅ Prepare order payload with user_id from session
      const orderPayload = {
        user_id: session.user.id || null, // ✅ Get user_id from session
        customer_name: formValues.customer_name,
        customer_email: formValues.customer_email,
        customer_phone: formValues.customer_phone,
        shipping_address: formValues.shipping_address,
        shipping_city: formValues.shipping_city,
        shipping_state: formValues.shipping_state,
        shipping_postal_code: formValues.shipping_postal_code,
        shipping_country: formValues.shipping_country,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        items: cartItems,
        subtotal: subtotal,
        shipping_cost: shipping,
        total_amount: total,
      };

      console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

      // Send POST request to create order
      const response = await axios.post("/api/orders", orderPayload);

      console.log("✅ Order created:", response.data);

      const orderId = response.data.order.order_id;
      const orderNumber = response.data.order.order_number;

      console.log("Order ID:", orderId);
      console.log("Order Number:", orderNumber);

      // Clear cart from localStorage
      localStorage.removeItem("cartItems");
      
      console.log("✅ Cart cleared from localStorage");

      // Redirect to confirmation page
      router.push(`/order/confirmation/${orderId}`);
    } catch (error: any) {
      console.error("❌ Order creation failed:", error);
      console.error("Error response:", error.response?.data);
      
      alert(
        error.response?.data?.error || 
        error.response?.data?.details ||
        "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // Show loading while checking authentication
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[rgba(255,255,255,0.16)] border-t-white rounded-full animate-spin" />
            <p className="text-white">Preparing checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show message if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-white/60 mb-6">Add items to your cart before checking out</p>
          <button
            onClick={() => router.push("/cart")}
            className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Checkout</h1>
          <p className="text-[rgba(255,255,255,0.6)] mt-1">
            Secure checkout — review & place your order
          </p>
          {/* ✅ Show logged in user */}
          {session?.user && (
            <p className="text-sm text-white/60 mt-2">
              Logged in as: {session.user.email}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* LEFT: Shipping Form */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping & Contact</h2>
              <CheckoutForm 
                formValues={formValues}
                onChange={setFormValues}
              />
            </div>
          </div>

          {/* RIGHT: Summary + Items */}
          <div className="space-y-6 lg:sticky lg:top-4">
            {/* Order Summary */}
            <CheckoutSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              itemCount={cartItems.length}
              onChangeShipping={(m) => setShippingMethod(m)}
              shippingMethod={shippingMethod}
              onPlaceOrder={handlePlaceOrder}
              placingOrder={placingOrder}
            />

            {/* Order Review (Cart Items) */}
            <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">
                Order Items ({cartItems.length})
              </h3>
              <OrderReview items={cartItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
