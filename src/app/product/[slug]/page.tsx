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
import ProductBadges from "@/components/ProductComp/ProductBadges"
import ProductTabs from "@/components/ProductComp/ProductTabs";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch from your API endpoint
        const response = await axios.get(`/api/products/${slug}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = (quantity: number) => {
    console.log("Adding to cart:", { product, quantity, selectedVariant });
    // Implement cart logic
  };

  const handleAddToWishlist = () => {
    console.log("Adding to wishlist:", product);
    // Implement wishlist logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <button
            onClick={() => router.push("/shop")}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl text-white transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-white/60">
          <button onClick={() => router.push("/")} className="hover:text-white">
            Home
          </button>
          <span>/</span>
          <button onClick={() => router.push("/shop")} className="hover:text-white">
            Parts
          </button>
          <span>/</span>
          <button onClick={() => router.push("/shop?category=exhaust")} className="hover:text-white">
            Exhaust
          </button>
          <span>/</span>
          <span className="text-white truncate">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* LEFT: Image Gallery */}
          <ProductImageGallery
            images={product.images || []}
            productName={product.name}
          />

          {/* RIGHT: Product Details */}
          <div className="space-y-6">
            <ProductInfo
              name={product.name}
              sku={product.sku}
              brand="Akrapovič"
              shortDescription={product.short_description}
              compatibility={{
                bike_model: "Himalayan 450",
                bike_brand: "Royal Enfield",
              }}
            />

            <ProductPricing
              regularPrice={product.regular_price}
              salePrice={product.sale_price}
            />

            {product.variants && product.variants.length > 0 && (
              <ProductVariants
                variants={product.variants}
                onVariantSelect={setSelectedVariant}
              />
            )}

            <ProductBadges
              stockQuantity={product.stock_quantity}
              warrantyMonths={product.warranty_months}
            />

            <ProductActions
              maxQuantity={product.stock_quantity}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs
          description={product.description}
          specifications={{
            Material: product.material || "High-Grade Titanium & Carbon Fiber",
            Weight: product.weight ? `${product.weight} kg` : "3.8 kg (1.7 kg lighter than stock)",
            "Power Increase": "+2.1 kW at 9900 rpm",
            "Torque Increase": "+2.4 Nm at 5100 rpm",
          }}
          fitmentGuide={product.fitment_guide}
        />
      </div>
    </div>
  );
}
