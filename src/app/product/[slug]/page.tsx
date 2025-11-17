// app/product/[slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductImageGallery from "@/components/ProductComp/ProductImageGallery";
import ProductInfo from "@/components/ProductComp/ProductInfo";
import ProductPricing from "@/components/ProductComp/ProductPricing";
import ProductVariants from "@/components/ProductComp/ProductVariants";
import ProductActions from "@/components/ProductComp/ProductActions";
import ProductBadges from "@/components/ProductComp/ProductBadges";
import ProductTabs from "@/components/ProductComp/ProductTabs";
import BottomNav from "@/components/BottomNavbar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: session } = useSession();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // same API endpoints — no backend changes
        const response = await axios.get(`/api/products/${slug}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = (quantity: number) => {
    if (!product) return;

    // 1. Get existing cart from localStorage - USE SAME KEY AS CART PAGE
    let cart = [];
    const existingCart = localStorage.getItem("cartItems"); // Same key used across app
    if (existingCart) {
      cart = JSON.parse(existingCart);
    }

    // 2. Create the cart item matching your CartItemProps structure
    const cartItem = {
      cart_item_id: `cart_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      product: {
        product_id: product.product_id,
        name: product.name,
        slug: product.slug,
        image_url: product.images?.[0]?.image_url || "",
        regular_price: product.regular_price,
        sale_price: product.sale_price,
      },
      variant: selectedVariant
        ? {
            variant_id: selectedVariant.variant_id,
            variant_name: selectedVariant.variant_name,
            color: selectedVariant.color,
            additional_price: selectedVariant.additional_price,
          }
        : undefined,
      quantity: quantity,
    };

    // 3. Check if item already exists (same product + variant)
    const existingItemIndex = cart.findIndex(
      (item: any) =>
        item.product.product_id === cartItem.product.product_id &&
        item.variant?.variant_id === cartItem.variant?.variant_id
    );

    // 4. Update quantity if exists, otherwise add new item
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    // 5. Save updated cart back to localStorage - USE SAME KEY AS CART PAGE
    localStorage.setItem("cartItems", JSON.stringify(cart));

    alert(`Added ${quantity} item(s) to cart!`);
  };

  const wishList = {
    user_id: session?.user?.id,
    product_id: product?.product_id,
  };

  const handleAddToWishlist = async () => {
    // Check if user is logged in
    if (!session?.user) {
      alert("Please login to add to wishlist");
      return;
    }

    // Check if product_id exists
    if (!product?.product_id) {
      alert("Invalid product");
      return;
    }

    try {
      const response = await axios.post("/api/wishlist", wishList);
      console.log("✅ Success:", response.data);
      alert("Added to wishlist!");
    } catch (error: any) {
      console.error("❌ Error:", error);
      alert(error.response?.data?.error || "Failed to add to wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl border">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[rgba(255,255,255,0.12)] border-t-white rounded-full animate-spin" />
            <p className="text-sm">Loading product...</p>
          </div>
        </div>
        <style jsx>{`
          .glass-panel {
            background-color: rgba(255, 255, 255, 0.02);
            border-color: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
            backface-visibility: hidden; /* helps reduce flicker */
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl border text-center">
          <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
          <button
            onClick={() => router.push("/shop")}
            className="btn-muted px-6 py-3 rounded-xl"
          >
            Back to Shop
          </button>
        </div>
        <style jsx>{`
          .glass-panel {
            background-color: rgba(255, 255, 255, 0.02);
            border-color: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
            backface-visibility: hidden;
          }
          .btn-muted {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.92);
            transition: opacity 120ms ease;
          }
          .btn-muted:hover {
            opacity: 0.95;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
            <button onClick={() => router.push("/")} className="crumb-btn">
              Home
            </button>
            <span>/</span>
            <button onClick={() => router.push("/shop")} className="crumb-btn">
              Parts
            </button>
            <span>/</span>
            <button
              onClick={() => router.push("/shop?category=exhaust")}
              className="crumb-btn"
            >
              Exhaust
            </button>
            <span>/</span>
            <span className="text-white truncate">{product.name}</span>
          </div>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* LEFT: Image Gallery */}
            <div className="glass-panel p-4 rounded-2xl border">
              <ProductImageGallery
                images={product.images || []}
                productName={product.name}
              />
            </div>

            {/* RIGHT: Product Details */}
            <div className="space-y-6">
              <div className="glass-panel p-5 rounded-2xl border">
                <ProductInfo
                  name={product.name}
                  sku={product.sku}
                  brand={product.brand ?? "Unknown"}
                  shortDescription={product.short_description}
                  compatibility={{
                    bike_model: product.fit_for || "Himalayan 450",
                    bike_brand: product.brand ?? "Royal Enfield",
                  }}
                />

                <div className="mt-4">
                  <ProductPricing
                    regularPrice={product.regular_price}
                    salePrice={product.sale_price}
                  />
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div className="mt-4">
                    <ProductVariants
                      variants={product.variants}
                      onVariantSelect={setSelectedVariant}
                    />
                  </div>
                )}

                <div className="mt-4">
                  <ProductBadges
                    stockQuantity={product.stock_quantity}
                    warrantyMonths={product.warranty_months}
                  />
                </div>

                <div className="mt-6">
                  <ProductActions
                    maxQuantity={product.stock_quantity}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="glass-panel p-6 rounded-2xl border">
            <ProductTabs
              description={product.description}
              specifications={{
                Material:
                  product.material || "High-Grade Titanium & Carbon Fiber",
                Weight: product.weight
                  ? `${product.weight} kg`
                  : "3.8 kg (1.7 kg lighter than stock)",
                "Power Increase": "+2.1 kW at 9900 rpm",
                "Torque Increase": "+2.4 Nm at 5100 rpm",
              }}
              fitmentGuide={product.fitment_guide}
            />
          </div>
        </div>

        <style jsx global>{`
          /* global tweaks to keep palette minimal and reduce rendering glitches */
          :root {
            --muted-white: rgba(255, 255, 255, 0.92);
            --panel-bg: rgba(255, 255, 255, 0.02);
            --panel-border: rgba(255, 255, 255, 0.04);
            --accent-green: rgba(
              56,
              189,
              248,
              0.9
            ); /* teal-ish green available for accents */
          }

          .glass-panel {
            background-color: var(--panel-bg);
            border: 1px solid var(--panel-border);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            box-shadow: 0 6px 22px rgba(0, 0, 0, 0.6);
            backface-visibility: hidden;
            transition: box-shadow 160ms ease, background-color 160ms ease;
          }

          /* crumb buttons: subtle opacity change instead of text color/hard hover */
          .crumb-btn {
            background: transparent;
            border: none;
            padding: 0;
            color: rgba(255, 255, 255, 0.68);
            cursor: pointer;
            transition: opacity 120ms ease;
          }
          .crumb-btn:hover {
            opacity: 0.92;
          }

          /* Muted button style used across the page */
          .btn-muted {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            color: var(--muted-white);
            transition: opacity 120ms ease;
          }

          /* Provide a single accent color for calls to action when needed */
          .accent-green {
            color: var(--accent-green);
            border-color: rgba(56, 189, 248, 0.12);
          }

          /* small performance hint to the browser to reduce flicker */
          .glass-panel,
          .crumb-btn,
          .btn-muted {
            transform: translateZ(0);
            will-change: box-shadow, opacity;
          }

          /* reduce noisy hover transitions that could trigger re-paint of backdrop */
          *:hover {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
          }
        `}</style>
      </div>

      <BottomNav />
      <Footer />
    </>
  );
}
