// components/shop/ShopHeader.tsx
"use client";

import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { FaSearch, FaMotorcycle, FaTh, FaList, FaTimes } from "react-icons/fa";

type ShopHeaderProps = {
  totalResults: number;
  currentView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onSearchSelect: (modelName: string) => void;
};

export default function ShopHeader({
  totalResults,
  currentView,
  onViewChange,
  sortBy,
  onSortChange,
  onSearchSelect,
}: ShopHeaderProps) {
  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [brandResults, setBrandResults] = useState<any[]>([]);
  const [modelResults, setModelResults] = useState<any[]>([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const brandRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const brandInputRef = useRef<HTMLInputElement | null>(null);
  const modelInputRef = useRef<HTMLInputElement | null>(null);

  // Debounced brand lookup
  useEffect(() => {
    if (bikeBrand.length < 2) {
      setBrandResults([]);
      setShowBrandDropdown(false);
      setIsLoadingBrands(false);
      return;
    }

    setIsLoadingBrands(true);
    const timer = setTimeout(() => {
      axios
        .get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/motorcycle?format=json`
        )
        .then((response) => {
          const filtered = response.data.Results.filter((brand: any) =>
            brand.MakeName.toLowerCase().includes(bikeBrand.toLowerCase())
          );
          setBrandResults(filtered.slice(0, 8));
          setShowBrandDropdown(true);
        })
        .catch(() => {
          setBrandResults([]);
          setShowBrandDropdown(false);
        })
        .finally(() => {
          setIsLoadingBrands(false);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [bikeBrand]);

  // Debounced model lookup
  useEffect(() => {
    if (!bikeBrand || bikeModel.length < 1) {
      setModelResults([]);
      setShowModelDropdown(false);
      setIsLoadingModels(false);
      return;
    }

    setIsLoadingModels(true);
    const timer = setTimeout(() => {
      axios
        .get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${bikeBrand}?format=json`
        )
        .then((response) => {
          const filtered = response.data.Results.filter((model: any) =>
            model.Model_Name.toLowerCase().includes(bikeModel.toLowerCase())
          );
          setModelResults(filtered.slice(0, 8));
          setShowModelDropdown(true);
        })
        .catch(() => {
          setModelResults([]);
          setShowModelDropdown(false);
        })
        .finally(() => {
          setIsLoadingModels(false);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [bikeModel, bikeBrand]);

  // Click outside & Escape handling to close dropdowns
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (brandRef.current && !brandRef.current.contains(target)) {
        setShowBrandDropdown(false);
      }
      if (modelRef.current && !modelRef.current.contains(target)) {
        setShowModelDropdown(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowBrandDropdown(false);
        setShowModelDropdown(false);
        brandInputRef.current?.blur();
        modelInputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleBrandSelect = useCallback((brandName: string) => {
    setBikeBrand(brandName);
    setBikeModel("");
    setBrandResults([]);
    setShowBrandDropdown(false);
    // focus model input after selecting brand
    setTimeout(() => modelInputRef.current?.focus(), 0);
  }, []);

  const handleModelSelect = useCallback(
    (modelName: string) => {
      setBikeModel(modelName);
      setModelResults([]);
      setShowModelDropdown(false);
      onSearchSelect(modelName);
    },
    [onSearchSelect]
  );

  const clearBrandSearch = () => {
    setBikeBrand("");
    setBikeModel("");
    setBrandResults([]);
    setModelResults([]);
    onSearchSelect("");
    setShowBrandDropdown(false);
    setShowModelDropdown(false);
  };

  return (
    <div className="relative z-40">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-col gap-5">
          {/* Header Row */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Shop Products
              </h2>
              <p className="text-white/60 text-sm">
                {totalResults} {totalResults === 1 ? "product" : "products"}{" "}
                available
              </p>
            </div>

            {/* View Toggle - Desktop */}
            <div className="hidden sm:flex backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-1 shadow-lg">
              <button
                onClick={() => onViewChange("grid")}
                className={`p-3 rounded-lg transition-all flex items-center gap-2 ${
                  currentView === "grid"
                    ? "bg-white text-black shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                aria-label="Grid view"
                aria-pressed={currentView === "grid"}
              >
                <FaTh className="w-4 h-4" />
                <span className="text-sm font-medium hidden lg:inline">
                  Grid
                </span>
              </button>
              <button
                onClick={() => onViewChange("list")}
                className={`p-3 rounded-lg transition-all flex items-center gap-2 ${
                  currentView === "list"
                    ? "bg-white text-black shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                aria-label="List view"
                aria-pressed={currentView === "list"}
              >
                <FaList className="w-4 h-4" />
                <span className="text-sm font-medium hidden lg:inline">
                  List
                </span>
              </button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Bike Brand Search */}
            <div ref={brandRef} className="relative flex-1 lg:max-w-xs">
              <label htmlFor="brand-search" className="sr-only">
                Search bike brand
              </label>
              <div className="relative">
                <input
                  id="brand-search"
                  ref={brandInputRef}
                  type="text"
                  placeholder="Search brand (e.g., Honda, Yamaha)"
                  value={bikeBrand}
                  onChange={(e) => setBikeBrand(e.target.value)}
                  onFocus={() =>
                    brandResults.length > 0 && setShowBrandDropdown(true)
                  }
                  className="w-full backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
                  autoComplete="off"
                />
                <FaMotorcycle
                  className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
                  aria-hidden="true"
                />

                {bikeBrand && (
                  <button
                    onClick={clearBrandSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    aria-label="Clear brand search"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}

                {isLoadingBrands && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Brand Dropdown - positioned absolutely within the header (not fixed) */}
              {showBrandDropdown && brandResults.length > 0 && (
                <div
                  className="absolute left-0 top-full mt-3 w-full backdrop-blur-xl bg-black/95 border border-white/20 rounded-xl max-h-80 overflow-y-auto z-50 shadow-2xl"
                  role="listbox"
                  aria-label="Brand suggestions"
                >
                  <div className="sticky top-0 backdrop-blur-md bg-white/5 p-3 text-xs text-white/60 border-b border-white/10 font-medium">
                    {brandResults.length}{" "}
                    {brandResults.length === 1 ? "brand" : "brands"} found
                  </div>
                  {brandResults.map((brand, i) => (
                    <div
                      key={i}
                      onMouseDown={() => handleBrandSelect(brand.MakeName)}
                      className="px-4 py-3.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                      role="option"
                      aria-selected={bikeBrand === brand.MakeName}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center text-white font-bold text-sm">
                          {brand.MakeName.charAt(0)}
                        </div>
                        <p className="text-white font-semibold">
                          {brand.MakeName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bike Model Search */}
            <div ref={modelRef} className="relative flex-1 lg:max-w-xs">
              <label htmlFor="model-search" className="sr-only">
                Search bike model
              </label>
              <div className="relative">
                <input
                  id="model-search"
                  ref={modelInputRef}
                  type="text"
                  placeholder={
                    bikeBrand ? "Search model..." : "Select brand first"
                  }
                  value={bikeModel}
                  onChange={(e) => setBikeModel(e.target.value)}
                  onFocus={() =>
                    modelResults.length > 0 && setShowModelDropdown(true)
                  }
                  disabled={!bikeBrand}
                  className="w-full backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  autoComplete="off"
                />
                <FaSearch
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
                  aria-hidden="true"
                />

                {isLoadingModels && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Model Dropdown - positioned absolutely within the header (not fixed) */}
              {showModelDropdown && modelResults.length > 0 && (
                <div
                  className="absolute left-0 top-full mt-3 w-full backdrop-blur-xl bg-black/95 border border-white/20 rounded-xl max-h-80 overflow-y-auto z-50 shadow-2xl"
                  role="listbox"
                  aria-label="Model suggestions"
                >
                  <div className="sticky top-0 backdrop-blur-md bg-white/5 p-3 text-xs text-white/60 border-b border-white/10 font-medium">
                    {modelResults.length}{" "}
                    {modelResults.length === 1 ? "model" : "models"} found
                  </div>
                  {modelResults.map((model, i) => (
                    <div
                      key={i}
                      onMouseDown={() => handleModelSelect(model.Model_Name)}
                      className="px-4 py-3.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                      role="option"
                      aria-selected={bikeModel === model.Model_Name}
                    >
                      <p className="text-white font-semibold">
                        {model.Model_Name}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {model.Make_Name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 lg:max-w-xs">
              <label htmlFor="sort-select" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 cursor-pointer appearance-none transition-all"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.25rem",
                }}
              >
                <option value="featured" className="bg-gray-900">
                  ✨ Featured
                </option>
                <option value="price-low" className="bg-gray-900">
                  💰 Price: Low to High
                </option>
                <option value="price-high" className="bg-gray-900">
                  💎 Price: High to Low
                </option>
                <option value="newest" className="bg-gray-900">
                  🆕 Newest First
                </option>
                <option value="popular" className="bg-gray-900">
                  🔥 Most Popular
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
