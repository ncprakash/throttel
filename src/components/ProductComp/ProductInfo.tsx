// components/product/ProductInfo.tsx
"use client";

type ProductInfoProps = {
  name: string;
  sku: string;
  brand?: string;
  shortDescription: string;
  compatibility?: {
    bike_model: string;
    bike_brand: string;
  };
  reviewCount?: number;
  rating?: number;
};

export default function ProductInfo({
  name,
  sku,
  brand,
  shortDescription,
  compatibility,
  reviewCount = 124,
  rating = 4.5,
}: ProductInfoProps) {
  return (
    <div className="space-y-4">
      {/* Compatibility Badge */}
      {compatibility && (
        <div className="backdrop-blur-md bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Fits Your {compatibility.bike_brand} {compatibility.bike_model}
              </h3>
              <p className="text-sm text-green-300/80">
                This part is confirmed to be compatible with your selected
                motorcycle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {name}
        </h1>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>SKU: {sku}</span>
          {brand && (
            <>
              <span>|</span>
              <span>
                Brand: <span className="text-white">{brand}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(rating)
                  ? "text-yellow-400 fill-current"
                  : "text-white/20 fill-current"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-white/70">({reviewCount} Reviews)</span>
        <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          Write a review
        </button>
      </div>

      {/* Short Description */}
      {shortDescription && (
        <p className="text-white/70 leading-relaxed">{shortDescription}</p>
      )}
    </div>
  );
}
