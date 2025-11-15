// components/product/ProductImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImage = {
  image_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
};

type ProductImageGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 aspect-square relative overflow-hidden group">
        <div className="relative w-full h-full">
          <Image
            src={images[selectedIndex]?.image_url || "/placeholder.jpg"}
            alt={images[selectedIndex]?.alt_text || productName}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            priority
          />
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 backdrop-blur-md bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.image_id}
              onClick={() => setSelectedIndex(index)}
              className={`backdrop-blur-md border rounded-xl p-2 w-20 h-20 flex-shrink-0 cursor-pointer transition-all ${
                selectedIndex === index
                  ? "border-white bg-white/10 scale-105"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.image_url}
                  alt={image.alt_text}
                  fill
                  className="object-contain rounded"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
