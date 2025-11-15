// components/shop/FilterSidebar.tsx
"use client";

import { useState } from "react";

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

export default function FilterSidebar({
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
        backdrop-blur-2xl bg-black/40 lg:bg-white/5 
        border-r lg:border border-white/10 
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
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="flex flex-wrap gap-2 mb-3">
              {activeFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="backdrop-blur-md bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-1.5 text-sm text-white flex items-center gap-2"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => onRemoveFilter(filter.id)}
                    className="hover:text-purple-300"
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
              className="w-full backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Compatibility Check */}
        <div className="mb-6">
          <div className="backdrop-blur-md bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
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
                <p className="text-xs text-white/70">
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
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            {compatibilityCheck && (
              <div className="text-xs text-green-300 bg-green-500/10 rounded-lg p-2 mt-2">
                ✓ Showing parts for <strong>Himalayan 450</strong>
              </div>
            )}
          </div>
        </div>

        {/* Price Range */}
       

        {/* Brand Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-4">Brand</h4>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search brands..."
                className="w-full backdrop-blur-sm bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                      }
                    }}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
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
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <span className="flex">
                {[1, 2, 3].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
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
          <label className="flex items-center justify-between cursor-pointer backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <span className="text-sm font-semibold text-white">In Stock Only</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </label>
        </div>
      </div>
    </>
  );
}
