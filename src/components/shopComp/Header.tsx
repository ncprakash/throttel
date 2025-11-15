// components/shop/ShopHeader.tsx
"use client";

type ShopHeaderProps = {
  totalResults: number;
  currentView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
};

export default function ShopHeader({
  totalResults,
  currentView,
  onViewChange,
  sortBy,
  onSortChange,
}: ShopHeaderProps) {
  return (
    <div
      className="
        backdrop-blur-xl 
        bg-[rgba(255,255,255,0.04)] 
        border 
        border-[rgba(255,255,255,0.08)] 
        rounded-2xl p-4 sm:p-6 mb-6
      "
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Results Count */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Showing {totalResults} results
          </h2>
        </div>

        {/* Right: Sort & View Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="
                w-full sm:w-auto
                backdrop-blur-md
                bg-[rgba(255,255,255,0.06)]
                border border-[rgba(255,255,255,0.08)]
                rounded-xl px-4 py-2.5 text-white text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.06)]
                hover:bg-[rgba(255,255,255,0.08)]
                transition-all cursor-pointer
              "
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex backdrop-blur-md bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-xl p-1">
            <button
              onClick={() => onViewChange("grid")}
              className={`p-2 rounded-lg transition-all ${
                currentView === "grid"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>

            <button
              onClick={() => onViewChange("list")}
              className={`p-2 rounded-lg transition-all ${
                currentView === "list"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
              aria-label="List view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
