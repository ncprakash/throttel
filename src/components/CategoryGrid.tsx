// components/CategoryGrid.tsx
'use client';
import { useState } from 'react';

const categories = [
  { 
    name: 'Exhaust Systems', 
    count: 248, 
    description: 'High-performance exhaust systems',
    gradient: 'from-red-500/20 to-orange-500/10'
  },
  { 
    name: 'Air Intakes', 
    count: 156, 
    description: 'Cold air intake systems',
    gradient: 'from-blue-500/20 to-cyan-500/10'
  },
  { 
    name: 'ECU Tuners', 
    count: 89, 
    description: 'Performance tuning modules',
    gradient: 'from-purple-500/20 to-pink-500/10'
  },
  { 
    name: 'Brake Systems', 
    count: 312, 
    description: 'High-performance braking',
    gradient: 'from-yellow-500/20 to-amber-500/10'
  },
  { 
    name: 'Suspension', 
    count: 198, 
    description: 'Upgraded suspension kits',
    gradient: 'from-green-500/20 to-emerald-500/10'
  },
  { 
    name: 'Protection', 
    count: 267, 
    description: 'Frame sliders & guards',
    gradient: 'from-gray-500/20 to-slate-500/10'
  },
  { 
    name: 'Styling', 
    count: 445, 
    description: 'Custom bodywork & accents',
    gradient: 'from-indigo-500/20 to-violet-500/10'
  },
  { 
    name: 'Track Gear', 
    count: 134, 
    description: 'Race-ready equipment',
    gradient: 'from-rose-500/20 to-red-500/10'
  },
];

export default function CategoryGrid() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 py-20 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10 mb-6">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-white/80 text-sm font-medium tracking-widest uppercase">
              Performance Categories
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Elevate Your Ride
            </span>
            <span className="block text-3xl md:text-4xl text-white/40 font-light mt-4">
              Premium parts for peak performance
            </span>
          </h2>
          
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of high-performance motorcycle components, 
            engineered for riders who demand excellence.
          </p>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.name}
              category={category}
              index={index}
              isActive={activeCategory === index}
              onHover={() => setActiveCategory(index)}
              onLeave={() => setActiveCategory(null)}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">1,849+</div>
            <div className="text-white/60 text-sm font-medium uppercase tracking-widest mt-2">Products</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
            <div className="text-white/60 text-sm font-medium uppercase tracking-widest mt-2">Support</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Global</div>
            <div className="text-white/60 text-sm font-medium uppercase tracking-widest mt-2">Shipping</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">2-Year</div>
            <div className="text-white/60 text-sm font-medium uppercase tracking-widest mt-2">Warranty</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ 
  category, 
  index, 
  isActive, 
  onHover, 
  onLeave 
}: { 
  category: typeof categories[0];
  index: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className={`group relative h-80 rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer ${
        isActive 
          ? 'border-white/30 scale-105 shadow-2xl' 
          : 'border-white/10 hover:border-white/20'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} transition-all duration-700 ${
        isActive ? 'opacity-30' : 'opacity-20 group-hover:opacity-25'
      }`} />
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 text-white">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-white/40 text-sm font-medium mb-2">
              0{(index % 8) + 1}
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-all duration-500 ${
              isActive ? 'text-white' : 'text-white/90'
            }`}>
              {category.name}
            </h3>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              {category.description}
            </p>
          </div>
          
          {/* Animated Icon */}
          <div className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${
            isActive ? 'scale-110 rotate-12 bg-white/20' : 'group-hover:scale-105'
          }`}>
            <div className="w-6 h-6 bg-current opacity-60 rounded-full" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white/90">
              {category.count}
            </span>
            <span className="text-white/40 text-sm font-light">
              products
            </span>
          </div>
          
          {/* CTA Button */}
          <button className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-500 ${
            isActive 
              ? 'bg-white/20 border-white/40 text-white' 
              : 'bg-white/10 border-white/20 text-white/70 group-hover:bg-white/15 group-hover:border-white/30'
          }`}>
            <span className="text-sm font-medium">View</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-500 ${
                isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Active State Glow */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse" />
      )}
    </div>
  );
}