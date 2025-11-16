// components/shop/FilterSidebar.tsx
"use client";

import { useState } from "react";
import axios from "axios";
type Filter = {
  id: string;
  label: string;
  type: "checkbox" | "range" | "toggle";
  value?: any;
};

type FilterSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: Filter[];
  onRemoveFilter: (id: string) => void;
  onClearAll: () => void;
};

export default  function FilterSidebar({
  isOpen,
  onClose,
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([250, 4500]);
  const [selectedBrands, setSelectedBrands] = useState(["Akrapovič"]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [compatibilityCheck, setCompatibilityCheck] = useState(true);

  const brands = ["Akrapovič", "Yoshimura", "Brembo", "Öhlins", "SC-Project"];
  

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 lg:w-full
        backdrop-blur-2xl bg-[rgba(0,0,0,0.45)] lg:bg-[rgba(255,255,255,0.03)]
        border-r lg:border border-[rgba(255,255,255,0.08)]
        rounded-none lg:rounded-2xl
        p-6
        overflow-y-auto
        transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Active Filters</h3>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white"
            aria-label="Close filters"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="mb-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex flex-wrap gap-2 mb-3">
              {activeFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="backdrop-blur-md bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-1.5 text-sm text-white flex items-center gap-2"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => onRemoveFilter(filter.id)}
                    className="hover:text-white/90"
                    aria-label={`Remove ${filter.label}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={onClearAll}
              className="w-full backdrop-blur-md bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-sm text-white transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Compatibility Check */}
        <div className="mb-6">
          <div className="backdrop-blur-md bg-[linear-gradient(180deg,rgba(34,197,94,0.06),transparent)] border border-[rgba(34,197,94,0.12)] rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[rgba(34,197,94,1)]"
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
                  Check Compatibility
                </h4>
                <p className="text-xs text-[rgba(255,255,255,0.75)]">
                  See parts that fit your bike
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={compatibilityCheck}
                  onChange={(e) => setCompatibilityCheck(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[rgba(255,255,255,0.12)] peer-focus:outline-none rounded-full relative peer-checked:bg-[rgba(34,197,94,1)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

            {compatibilityCheck && (
              <div className="text-xs text-[rgba(34,197,94,1)] bg-[rgba(34,197,94,0.06)] rounded-lg p-2 mt-2">
                ✓ Showing parts for <strong>Himalayan 450</strong>
              </div>
            )}
          </div>
        </div>

        {/* Price Range (placeholder UI; keep behavior same) */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">Price</h4>
          <div className="backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <div className="text-sm text-[rgba(255,255,255,0.8)] mb-3">
              {`$${priceRange[0]} — $${priceRange[1]}`}
            </div>
            {/* Keep the simple range inputs — replace with your range component if you have one */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-1/2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-1/2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-4">Brand</h4>
          <div className="backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search brands..."
                className="w-full backdrop-blur-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgba(255,255,255,0.08)]"
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(
                          selectedBrands.filter((b) => b !== brand)
                        );
                      }
                    }}
                    className="w-5 h-5 rounded border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] checked:bg-[rgba(34,197,94,1)] checked:border-[rgba(34,197,94,1)] focus:ring-2 focus:ring-[rgba(34,197,94,0.14)]"
                  />
                  <span className="text-sm text-white">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-4">Rating</h4>
          <div className="backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <button className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.75)] hover:text-white transition-colors">
              <span className="flex">
                {[1, 2, 3].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-[rgba(250,204,21,1)] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </span>
              <span>3 ★ & Up</span>
            </button>
          </div>
        </div>

        {/* Stock Filter */}
        <div className="mb-6">
          <label className="flex items-center justify-between cursor-pointer backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.06)] transition-colors">
            <span className="text-sm font-semibold text-white">
              In Stock Only
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[rgba(255,255,255,0.12)] peer-focus:outline-none rounded-full relative peer-checked:bg-[rgba(34,197,94,1)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </label>
        </div>
      </div>
    </>
  );
}
