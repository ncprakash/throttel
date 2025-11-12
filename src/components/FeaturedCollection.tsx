// components/FeaturedCollections.tsx
'use client';
import { useRef, useState } from 'react';

const collections = [
  {
    title: 'Best Sellers',
    subtitle: 'Most Popular This Month',
    description: 'Top-rated performance parts chosen by riders worldwide',
    products: 24,
    highlight: 'Up to 30% Off',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Latest Performance Parts',
    description: 'Fresh releases from premium manufacturers',
    products: 18,
    highlight: 'Just Landed',
  },
  {
    title: 'Track Essentials',
    subtitle: 'Race-Proven Components',
    description: 'Professional-grade equipment for serious riders',
    products: 12,
    highlight: 'Pro Choice',
  },
];

export default function FeaturedCollections() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="bg-white/0.02 py-32 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
                Curated Collections
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Featured Picks
            </h2>
            <p className="text-white/60 text-lg font-light max-w-xl">
              Hand-selected performance parts for discerning riders
            </p>
          </div>

          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center group"
            >
              <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center group"
            >
              <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {collections.map((collection, idx) => (
            <div
              key={idx}
              className="flex-none w-[85%] md:w-[calc(33.333%-16px)] snap-center"
            >
              <div className="group relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-700 cursor-pointer h-full">
                {/* Highlight Badge */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full">
                    {collection.highlight}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-700">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-light">
                      {collection.subtitle}
                    </p>
                    <h3 className="text-white text-3xl font-bold mb-3 group-hover:translate-x-1 transition-transform duration-700">
                      {collection.title}
                    </h3>
                    <p className="text-white/60 text-sm font-light leading-relaxed mb-4">
                      {collection.description}
                    </p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                      {collection.products} Products
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 flex items-center text-white group-hover:text-white/90 text-sm font-semibold group-hover:translate-x-2 transition-all duration-700">
                    Shop Collection
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                  <svg viewBox="0 0 100 100" className="text-white">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicators - Mobile */}
        <div className="flex justify-center items-center space-x-2 mt-8 md:hidden">
          {collections.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
