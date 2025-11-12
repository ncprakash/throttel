// components/HeroSection.tsx - WITH INTRO ON FIRST FRAME
'use client';
import { useState, useEffect } from 'react';
import ScrollRender from './ScrollRender';
import Image from 'next/image';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {isReducedMotion ? (
        <section className="relative bg-black text-white min-h-screen flex items-center justify-center">
          <Image 
            src="/frames/render1.png"
            alt="Throttle Forged Customs - Performance Motorcycle Engineering"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/80 flex items-center justify-center">
            <HeroContent isLoaded={true} />
          </div>
        </section>
      ) : (
       // In HeroSection.tsx
<ScrollRender 
  frameCount={7}
  containerHeight="250vh"  // Much shorter - animation completes faster
  className="z-10"
>

          {/* Hero Content Overlay - Shows on first frame */}
          <HeroContent isLoaded={isLoaded} />
        </ScrollRender>
      )}
    </>
  );
}

function HeroContent({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center pointer-events-none z-30 transition-all duration-1000 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="text-center px-6 max-w-5xl mx-auto pointer-events-auto">
        {/* Premium Badge */}
        <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-10 animate-fadeIn animation-delay-300">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase">
            Race-Bred Performance Engineering
          </span>
        </div>

        {/* Main Heading with staggered animation */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] animate-fadeIn animation-delay-500">
          <span className="text-white">THROTTLE</span>
          <span className="block text-white/30 font-light text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-tight">
            FORGED CUSTOMS
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide animate-fadeIn animation-delay-700">
          Precision-engineered performance parts for riders who demand excellence on every curve
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fadeIn animation-delay-1000">
          <button className="group relative bg-white text-black px-10 py-4 font-semibold text-base tracking-wide hover:bg-white/90 transition-all duration-500 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">Shop Performance Parts</span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          
          <button className="group relative border border-white text-white px-10 py-4 font-semibold text-base tracking-wide hover:bg-white/5 transition-all duration-500 backdrop-blur-sm">
            <span className="relative z-10">Build My Custom</span>
            <div className="absolute inset-0 border border-white/50 transform scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>

        {/* Value Propositions */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-white/50 font-light tracking-wide animate-fadeIn animation-delay-1000">
          <ValueProp icon="⚡" text="Race-Bred Performance" />
          <ValueProp icon="✓" text="Precision Fit & Finish" />
          <ValueProp icon="🌍" text="Global Fast Shipping" />
        </div>

        {/* Scroll Hint */}
        <div className="mt-16 animate-fadeIn animation-delay-1000">
          <div className="inline-flex flex-col items-center animate-bounce">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Scroll to Explore</p>
            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValueProp({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center space-x-3 group cursor-default">
      <div className="text-white/30 group-hover:text-white/60 transition-colors duration-300 text-xs">
        {icon}
      </div>
      <span className="group-hover:text-white transition-colors duration-300">
        {text}
      </span>
    </div>
  );
}
