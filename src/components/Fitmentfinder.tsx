// components/FitmentFinder.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function FitmentFinder() {
  const router = useRouter();
  const [bikeBrand, setBikeBrand] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [brandResults, setBrandResults] = useState<any[]>([]);
  const [modelResults, setModelResults] = useState<any[]>([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [productsFound, setProductsFound] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const brandRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  // Fetch bike brands with debouncing
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
        .get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/motorcycle?format=json`)
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

  // Fetch bike models
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
        .get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${bikeBrand}?format=json`)
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

  const handleBrandSelect = (brandName: string) => {
    setBikeBrand(brandName);
    setBikeModel('');
    setShowBrandDropdown(false);
    setProductsFound(null);
    setShowResults(false);
  };

  const handleModelSelect = (modelName: string) => {
    setBikeModel(modelName);
    setShowModelDropdown(false);
    setProductsFound(null);
    setShowResults(false);
  };

  const checkAvailability = async () => {
    if (!bikeModel) return;

    setIsCheckingAvailability(true);
    setShowResults(false);

    try {
      // Check if products exist for this bike model
      const response = await axios.get(`/api/products/search?bikeModel=${encodeURIComponent(bikeModel)}`);
      const count = response.data.products?.length || 0;
      setProductsFound(count);
      setShowResults(true);
    } catch (error) {
      console.error('Error checking availability:', error);
      setProductsFound(0);
      setShowResults(true);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleShopNow = () => {
    // Navigate to shop with the bike model as a filter
    router.push(`/shop?bikeModel=${encodeURIComponent(bikeModel)}`);
  };

  const clearSearch = () => {
    setBikeBrand('');
    setBikeModel('');
    setProductsFound(null);
    setShowResults(false);
  };

  return (
    <section className="bg-black py-32 px-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
              Find Your Perfect Fit
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Guaranteed Compatibility
          </h2>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Search your bike to discover perfectly matched performance parts
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bike Brand Search */}
            <div ref={brandRef} className="relative group">
              <label htmlFor="fitment-brand" className="block text-white/60 text-xs uppercase tracking-wider mb-3 font-light">
                Brand
              </label>
              <div className="relative">
                <input
                  id="fitment-brand"
                  type="text"
                  placeholder="e.g., Honda, Yamaha..."
                  value={bikeBrand}
                  onChange={(e) => setBikeBrand(e.target.value)}
                  onFocus={() => brandResults.length > 0 && setShowBrandDropdown(true)}
                  onBlur={() => setTimeout(() => setShowBrandDropdown(false), 200)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 font-light transition-all duration-300 hover:bg-white/15 placeholder-white/40"
                  autoComplete="off"
                />
                {isLoadingBrands && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                {bikeBrand && !isLoadingBrands && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Brand Dropdown */}
              {showBrandDropdown && brandResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/95 border border-white/20 rounded-xl max-h-80 overflow-y-auto z-50 shadow-2xl">
                  <div className="sticky top-0 backdrop-blur-md bg-white/5 p-3 text-xs text-white/60 border-b border-white/10 font-light">
                    {brandResults.length} {brandResults.length === 1 ? 'brand' : 'brands'} found
                  </div>
                  {brandResults.map((brand, i) => (
                    <div
                      key={i}
                      onMouseDown={() => handleBrandSelect(brand.MakeName)}
                      className="px-5 py-3.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {brand.MakeName.charAt(0)}
                        </div>
                        <p className="text-white font-medium">{brand.MakeName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bike Model Search */}
            <div ref={modelRef} className="relative group">
              <label htmlFor="fitment-model" className="block text-white/60 text-xs uppercase tracking-wider mb-3 font-light">
                Model
              </label>
              <div className="relative">
                <input
                  id="fitment-model"
                  type="text"
                  placeholder={bikeBrand ? "e.g., CBR1000RR..." : "Select brand first"}
                  value={bikeModel}
                  onChange={(e) => setBikeModel(e.target.value)}
                  onFocus={() => modelResults.length > 0 && setShowModelDropdown(true)}
                  onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                  disabled={!bikeBrand}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 font-light transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed placeholder-white/40"
                  autoComplete="off"
                />
                {isLoadingModels && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Model Dropdown */}
              {showModelDropdown && modelResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/95 border border-white/20 rounded-xl max-h-80 overflow-y-auto z-50 shadow-2xl">
                  <div className="sticky top-0 backdrop-blur-md bg-white/5 p-3 text-xs text-white/60 border-b border-white/10 font-light">
                    {modelResults.length} {modelResults.length === 1 ? 'model' : 'models'} found
                  </div>
                  {modelResults.map((model, i) => (
                    <div
                      key={i}
                      onMouseDown={() => handleModelSelect(model.Model_Name)}
                      className="px-5 py-3.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                    >
                      <p className="text-white font-medium">{model.Model_Name}</p>
                      <p className="text-xs text-white/50 mt-1">{model.Make_Name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Check Availability Button */}
            <div className="flex items-end">
              <button 
                onClick={checkAvailability}
                disabled={!bikeBrand || !bikeModel || isCheckingAvailability}
                className="w-full bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg"
              >
                {isCheckingAvailability ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Find Parts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {showResults && productsFound !== null && (
            <div className="mt-8 pt-8 border-t border-white/10 animate-fadeIn">
              {productsFound > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-white/60 text-sm font-light mb-1">Compatible Parts Found for</p>
                      <p className="text-white text-xl font-bold">{bikeBrand} {bikeModel}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl px-6 py-3">
                        <p className="text-emerald-400 text-3xl font-bold">{productsFound}</p>
                        <p className="text-emerald-400/60 text-xs font-light">Products</p>
                      </div>
                      <div className="flex items-center space-x-2 text-emerald-400 text-sm bg-emerald-500/10 rounded-xl px-4 py-3 border border-emerald-500/20">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Verified Fitment</span>
                      </div>
                    </div>
                  </div>

                  {/* Shop Now Button */}
                  <button
                    onClick={handleShopNow}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/50 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Shop Now - View All {productsFound} Compatible Parts</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Parts Found</h3>
                  <p className="text-white/60 font-light mb-6">
                    We don't have compatible parts for <span className="text-white font-medium">{bikeBrand} {bikeModel}</span> yet.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl text-white transition-all hover:scale-105 font-medium"
                  >
                    Try Another Bike
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/40">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-light">OEM Specifications</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-light">Easy Installation</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-light">Lifetime Support</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}
