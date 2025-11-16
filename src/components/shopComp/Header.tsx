// components/shop/ShopHeader.tsx
"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";

type ShopHeaderProps = {
  totalResults: number;
  currentView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onSearchSelect: (modelName: string) => void; // ADD THIS
};

export default function ShopHeader({
  totalResults,
  currentView,
  onViewChange,
  sortBy,
  onSortChange,
  onSearchSelect, // ADD THIS
}: ShopHeaderProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${search}?format=json`)
        .then((response) => {
          setResults(response.data.Results || []);
          setShow(true);
          
          if (searchRef.current) {
            const rect = searchRef.current.getBoundingClientRect();
            setDropdownPosition({
              top: rect.bottom + window.scrollY + 8,
              left: rect.left + window.scrollX,
              width: rect.width,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setResults([]);
          setShow(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectModel = (modelName: string) => {
    setSearch(modelName);
    setShow(false);
    onSearchSelect(modelName); // NOTIFY PARENT
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">
          Showing {totalResults} results
        </h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div ref={searchRef} className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search bikes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => results.length > 0 && setShow(true)}
              onBlur={() => setTimeout(() => setShow(false), 200)}
              className="w-full backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-400/60"
            />

            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none cursor-pointer"
          >
            <option value="featured" className="bg-gray-900">Featured</option>
            <option value="price-low" className="bg-gray-900">Price: Low</option>
            <option value="price-high" className="bg-gray-900">Price: High</option>
          </select>

          <div className="hidden sm:flex backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-1">
            <button onClick={() => onViewChange("grid")} className={`p-2 rounded-lg transition-all ${currentView === "grid" ? "bg-white text-black" : "text-white/60"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button onClick={() => onViewChange("list")} className={`p-2 rounded-lg transition-all ${currentView === "list" ? "bg-white text-black" : "text-white/60"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {show && results.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
          className="backdrop-blur-xl bg-black/95 border border-white/20 rounded-xl max-h-80 overflow-y-auto z-[9999] shadow-2xl"
        >
          <div className="sticky top-0 backdrop-blur-md bg-white/5 p-2 text-xs text-white/60 border-b border-white/10">
            Found {results.length} models
          </div>
          {results.map((m, i) => (
            <div
              key={i}
              onMouseDown={() => handleSelectModel(m.Model_Name)}
              className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
            >
              <p className="text-white font-medium">{m.Model_Name}</p>
              <p className="text-xs text-white/50 mt-1">{m.Make_Name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
