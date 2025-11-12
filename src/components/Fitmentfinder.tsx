// components/FitmentFinder.tsx
'use client';
import { useState } from 'react';

const years = ['2024', '2023', '2022', '2021', '2020', '2019'];
const makes = ['Ducati', 'BMW', 'Kawasaki', 'Yamaha', 'Honda', 'Suzuki', 'Aprilia', 'KTM'];
const models: Record<string, string[]> = {
  Ducati: ['Panigale V4', 'Panigale V2', 'Streetfighter V4', 'Monster', 'Multistrada'],
  BMW: ['S1000RR', 'M1000RR', 'S1000XR', 'F900R', 'R1250GS'],
  Kawasaki: ['ZX-10R', 'ZX-6R', 'Ninja 650', 'Z900', 'Ninja H2'],
  Yamaha: ['YZF-R1', 'YZF-R6', 'MT-09', 'MT-07', 'YZF-R7'],
};

export default function FitmentFinder() {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  return (
    <section className="bg-black py-32 px-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-linear-to-br from-white/0.02 to-transparent"></div>
      
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
            Enter your bike details to discover perfectly matched performance parts
          </p>
        </div>

        <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Year */}
            <div className="relative group">
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-3 font-light">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 font-light appearance-none cursor-pointer transition-all duration-300 hover:bg-white/15"
              >
                <option value="" className="bg-black">Select Year</option>
                {years.map(y => (
                  <option key={y} value={y} className="bg-black">{y}</option>
                ))}
              </select>
              <svg className="absolute right-5 top-[52px] w-4 h-4 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Make */}
            <div className="relative group">
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-3 font-light">
                Make
              </label>
              <select
                value={make}
                onChange={(e) => {
                  setMake(e.target.value);
                  setModel('');
                }}
                className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 font-light appearance-none cursor-pointer transition-all duration-300 hover:bg-white/15"
                disabled={!year}
              >
                <option value="" className="bg-black">Select Make</option>
                {makes.map(m => (
                  <option key={m} value={m} className="bg-black">{m}</option>
                ))}
              </select>
              <svg className="absolute right-5 top-[52px] w-4 h-4 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Model */}
            <div className="relative group">
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-3 font-light">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 font-light appearance-none cursor-pointer transition-all duration-300 hover:bg-white/15"
                disabled={!make}
              >
                <option value="" className="bg-black">Select Model</option>
                {make && models[make]?.map(m => (
                  <option key={m} value={m} className="bg-black">{m}</option>
                ))}
              </select>
              <svg className="absolute right-5 top-[52px] w-4 h-4 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button 
                disabled={!year || !make || !model}
                className="w-full bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Parts</span>
              </button>
            </div>
          </div>

          {/* Results Preview */}
          {year && make && model && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light mb-1">Compatible Parts Found</p>
                  <p className="text-white text-2xl font-bold">248 Products</p>
                </div>
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-light">Verified Fitment</span>
                </div>
              </div>
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
    </section>
  );
}
