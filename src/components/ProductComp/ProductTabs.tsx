// components/product/ProductTabs.tsx
"use client";

import { useState } from "react";

type ProductTabsProps = {
  description: string;
  specifications: Record<string, string>;
  fitmentGuide?: string;
  reviews?: Array<{
    user: string;
    rating: number;
    comment: string;
  }>;
};

export default function ProductTabs({
  description,
  specifications,
  fitmentGuide,
  reviews
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "fitment" | "reviews">(
    "description"
  );

  const tabs = [
    { id: "description" as const, label: "Description" },
    { id: "specs" as const, label: "Specifications" },
    { id: "fitment" as const, label: "Fitment" },
    { id: "reviews" as const, label: "Reviews" },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap flex-1 ${
              activeTab === tab.id
                ? "text-purple-400 border-b-2 border-purple-400 bg-white/5"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === "description" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Product Description
            </h3>
            <div className="text-white/70 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Technical Specifications
            </h3>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(specifications).map(([key, value], index) => (
                    <tr
                      key={key}
                      className={`hover:bg-white/10 transition-colors ${index % 2 === 0 ? "bg-white/5" : ""}`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-white/80 w-1/3 capitalize">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70 font-mono">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "fitment" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Fitment Guide</h3>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-white/70 leading-relaxed">
                {fitmentGuide || "Fitment information coming soon."}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="backdrop-blur-md bg-white/10 border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 grid place-items-center font-semibold text-white text-sm">
                        {review.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white truncate">{review.user}</span>
                          <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</span>
                        </div>
                        <p className="text-white/80 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <p className="text-white/50 italic">No reviews yet</p>
                  <p className="text-white/30 text-sm mt-2">Be the first to review this product</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
