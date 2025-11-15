// components/product/ProductTabs.tsx
"use client";

import { useState } from "react";

type ProductTabsProps = {
  description: string;
  specifications: Record<string, string>;
  fitmentGuide?: string;
};

export default function ProductTabs({
  description,
  specifications,
  fitmentGuide,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "fitment" | "reviews">(
    "description"
  );

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications" },
    { id: "fitment", label: "Fitment" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap ${
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
                      className={index % 2 === 0 ? "bg-white/5" : ""}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-white/80 w-1/3">
                        {key}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
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
            <div className="text-white/70 leading-relaxed">
              {fitmentGuide || "Fitment information coming soon."}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Customer Reviews</h3>
            <div className="text-white/70">No reviews yet. Be the first to review!</div>
          </div>
        )}
      </div>
    </div>
  );
}
