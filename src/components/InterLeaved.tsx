// components/InterleavedScrollExperience.tsx
"use client";

import { useEffect, useState, useRef } from "react";

import FeaturedCollections from "./FeaturedCollection";
import FitmentFinder from "./Fitmentfinder";
import USPStrip from "./UspStrip";
import EditorialSection from "./EditorialSection";
import ReviewsSection from "./ReviewSection";
import NewsletterCTA from "./NewsLetterCTA";

export default function InterleavedScrollExperience() {
  // Animation states
  const [stage, setStage] = useState(0); // 0: initial, 1: gear spin, 2: circle reveal, 3: text reveal, 4: complete
  const [radius, setRadius] = useState(0);
  const [gearRotation, setGearRotation] = useState(0);
  const [textReveal, setTextReveal] = useState(false);
  const [showHero, setShowHero] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload subtle mechanical sound
    audioRef.current = new Audio('/sounds/gear-engage.mp3');
    audioRef.current.volume = 0.3;

    const sequence = async () => {
      // Stage 0: Initial delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 1: Gear spin animation
      setStage(1);
      let rotation = 0;
      const spinInterval = setInterval(() => {
        rotation += 15;
        setGearRotation(rotation);
        if (rotation >= 360) {
          clearInterval(spinInterval);
          setStage(2);
          audioRef.current?.play().catch(() => {}); // Ignore audio errors
        }
      }, 30);

      // Stage 2: Circle reveal
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const revealDuration = 1200;
      const startTime = Date.now();
      
      const animateReveal = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / revealDuration, 1);
        
        // Ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentRadius = eased * 140;
        
        setRadius(currentRadius);
        
        if (progress < 1) {
          requestAnimationFrame(animateReveal);
        } else {
          setStage(3);
          
          // Stage 3: Text reveal with mechanical typewriter effect
          setTimeout(() => {
            setTextReveal(true);
            setTimeout(() => {
              setStage(4);
              setShowHero(true);
            }, 800);
          }, 300);
        }
      };
      
      animateReveal();
    };

    sequence();
  }, []);

  return (
    <div className="relative bg-black/80">
      {/* Static Background Image */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 animate-subtle-zoom"
          style={{
            backgroundImage: "url(/frames/render9_filled.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Base tint */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Animated gear overlay during initial sequence */}
        {stage < 4 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div 
              className="relative z-20 transition-all duration-500"
              style={{
                opacity: stage >= 1 ? 1 : 0,
                transform: `scale(${stage >= 1 ? 1 : 0.8}) rotate(${gearRotation}deg)`,
              }}
            >
              {/* Gear icon */}
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5"
                className="opacity-80"
              >
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            
            {/* Circle reveal mask */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(
                  circle at 50% 55%,
                  transparent 0%,
                  transparent ${radius}%,
                  rgba(0,0,0,0.98) ${radius + 1}%,
                  rgba(0,0,0,0.98) 140%
                )`,
                transition: stage === 2 ? 'none' : 'all 0.5s ease-out'
              }}
            />
          </div>
        )}

        {/* Final background state */}
        {stage === 4 && (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(
                  circle at 50% 55%,
                  transparent 0%,
                  transparent 140%,
                  rgba(0,0,0,0.96) 141%,
                  rgba(0,0,0,0.96) 200%
                )`,
              }}
            />
          </>
        )}
      </div>

      {/* Hero Content */}
      <div className="relative h-screen flex items-center justify-center z-10">
        <div className={`text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${
          showHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Animated badge */}
          <div className={`inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-10 transition-all duration-700 delay-300 ${
            showHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase">
              Race-Bred Performance Engineering
            </span>
          </div>

          {/* Main title with typewriter effect */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            <span className={`text-white inline-block transition-all duration-500 delay-500 ${
              textReveal ? 'opacity-100' : 'opacity-0'
            }`}>
              THROTTLE
            </span>
            <span className={`block text-white/30 font-light text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-tight transition-all duration-500 delay-700 ${
              textReveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              FORGED CUSTOMS
            </span>
          </h1>

          {/* Description */}
          <p className={`text-lg sm:text-xl lg:text-2xl text-white/70 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide transition-all duration-500 delay-900 ${
            showHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Precision-engineered performance parts for riders who demand excellence
          </p>

          {/* CTA Button */}
          <div className={`transition-all duration-500 delay-1000 ${
            showHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="relative min-h-screen z-10">
        <FeaturedCollections />
      </div>
      <div className="relative min-h-screen z-10">
        <FitmentFinder />
      </div>
      <div className="relative z-10">
        <USPStrip />
      </div>
      <div className="relative min-h-screen z-10">
        <EditorialSection />
      </div>
      <div className="relative z-10">
        <ReviewsSection />
        <NewsletterCTA />
      </div>
    </div>
  );
}