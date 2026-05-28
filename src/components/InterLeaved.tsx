// components/InterleavedScrollExperience.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import FeaturedCollections from "./FeaturedCollection";
import FitmentFinder from "./Fitmentfinder";
import USPStrip from "./UspStrip";
import EditorialSection from "./EditorialSection";
import ReviewsSection from "./ReviewSection";
import NewsletterCTA from "./NewsLetterCTA";
import Image from "next/image";

export default function InterleavedScrollExperience() {
  const router = useRouter();
  // Animation states
  const [stage, setStage] = useState(0); // 0: initial, 1: gear spin, 2: percentage count, 3: text reveal, 4: complete
  const [percentage, setPercentage] = useState(0);
  const [gearRotation, setGearRotation] = useState(0);
  const [textReveal, setTextReveal] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleExploreClick = () => {
    router.push("/shop");
  };

  useEffect(() => {
    const alreadyAnimated = sessionStorage.getItem("throttle-animation-shown");

    // Mark animation as shown in sessionStorage (prevents re-run during same session)
    sessionStorage.setItem("throttle-animation-shown", "true");

    if (alreadyAnimated) {
      // Skip animation and show final state directly
      setHasAnimated(true);
      setStage(4);
      setPercentage(100);
      setTextReveal(true);
      setShowHero(true);
      return;
    }

    // Preload subtle mechanical sound
    audioRef.current = new Audio("/sounds/gear-engage.mp3");
    audioRef.current.volume = 0.3;

    const sequence = async () => {
      // Stage 0: Initial delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stage 1: Gear spin animation
      setStage(1);
      let rotation = 0;
      const spinInterval = setInterval(() => {
        rotation += 15;
        setGearRotation(rotation);
        if (rotation >= 360) {
          clearInterval(spinInterval);
          setStage(2);
          audioRef.current?.play().catch(() => {});
        }
      }, 30);

      // Stage 2: Percentage count animation
      await new Promise((resolve) => setTimeout(resolve, 200));

      const countDuration = 1200;
      const startTime = Date.now();

      const animateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / countDuration, 1);

        // Ease-out curve for more realistic throttle feeling
        const eased = 1 - Math.pow(1 - progress, 2);
        const currentPercentage = Math.min(Math.floor(eased * 100), 100);

        setPercentage(currentPercentage);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setStage(3);

          // Stage 3: Text reveal after percentage completes
          setTimeout(() => {
            setTextReveal(true);
            setTimeout(() => {
              setStage(4);
              setShowHero(true);
              setHasAnimated(true);
              // Mark animation as shown in localStorage (persist across sessions)
              localStorage.setItem("throttle-animation-shown", "true");
            }, 800);
          }, 300);
        }
      };

      animateCount();
    };

    sequence();
  }, []);

  // If animation was already shown, skip the loading overlay
  if (hasAnimated) {
    return (
      <div className="relative bg-transparent">
        {/* Static Background Image - replaced with <img> for iOS stability */}
        <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
          <Image
            src="/frames/render1.png"
            alt=""
            fill
            className="absolute inset-0 w-full h-full object-cover -z-10 bg-image-stabilize subtle-zoom-onload"
            style={{ transform: "translateZ(0)" }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Hero Content - Immediately visible */}
        <div className="relative h-screen flex items-center justify-center z-10">
          <div className="text-center px-6 max-w-5xl mx-auto opacity-100 translate-y-0">
            {/* Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/20 mb-10 opacity-100 translate-y-0">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase">
                Race-Bred Performance Engineering
              </span>
            </div>

            {/* Main title */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              <span className="text-white opacity-100">THROTTLE</span>
              <span className="block text-white/40 font-light text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-tight opacity-100 translate-y-0">
                FORGED CUSTOMS
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide opacity-100 translate-y-0">
              Precision-engineered performance parts for riders who demand
              excellence
            </p>

            {/* CTA Button */}
            <div className="opacity-100 translate-y-0">
              <button
                onClick={handleExploreClick}
                className="bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-white/10"
              >
                Explore Performance Parts
              </button>
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

  return (
    <div className="relative bg-transparent">
      {/* Static Background Image - replaced with <img> for iOS stability */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <Image
          src="/frames/render1.png"
          alt=""
          fill
          className="absolute inset-0 w-full h-full object-cover -z-10 bg-image-stabilize subtle-zoom-onload"
          style={{ transform: "translateZ(0)" }}
          loading="eager"
        />

        {/* Reduced base tint - almost transparent */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Animated gear and percentage overlay during initial sequence */}
        {stage < 4 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            {/* Gear icon */}
            <div
              className="relative z-20 transition-all duration-500 mb-8"
              style={{
                opacity: stage >= 1 ? 1 : 0,
                transform: `scale(${
                  stage >= 1 ? 1 : 0.8
                }) rotate(${gearRotation}deg)`,
              }}
            >
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

            {/* Percentage display */}
            <div
              className="relative z-20 text-center transition-all duration-300"
              style={{
                opacity: stage >= 2 ? 1 : 0,
                transform: `scale(${stage >= 2 ? 1 : 0.9})`,
              }}
            >
              {/* Large percentage number */}
              <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 font-mono">
                {percentage}%
              </div>

              {/* Loading text */}
              <div className="text-white/70 text-sm sm:text-base uppercase tracking-widest font-light">
                {percentage < 100 ? "Throttle Engaged" : "Systems Online"}
              </div>

              {/* Progress bar */}
              <div className="w-48 sm:w-64 h-1 bg-white/20 rounded-full mt-6 mx-auto overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* RPM-style indicators */}
              <div className="flex justify-between w-48 sm:w-64 mx-auto mt-2">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div key={mark} className="text-xs text-white/50 font-mono">
                    {mark}
                  </div>
                ))}
              </div>
            </div>

            {/* Background fade reveal */}
            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                backgroundColor: `rgba(0,0,0,${
                  0.7 - (percentage / 100) * 0.7
                })`,
              }}
            />
          </div>
        )}

        {/* Final background state - minimal tint */}
        {stage === 4 && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          />
        )}
      </div>

      {/* Hero Content */}
      <div className="relative h-screen flex items-center justify-center z-10">
        <div
          className={`text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${
            showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Animated badge - Glassomorphic */}
          <div
            className={`inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/20 mb-10 transition-all duration-700 delay-300 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase">
              Race-Bred Performance Engineering
            </span>
          </div>

          {/* Main title with typewriter effect - Black & White Theme */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            <span
              className={`text-white inline-block transition-all duration-500 delay-500 ${
                textReveal ? "opacity-100" : "opacity-0"
              }`}
            >
              THROTTLE
            </span>
            <span
              className={`block text-white/40 font-light text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-tight transition-all duration-500 delay-700 ${
                textReveal
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              FORGED CUSTOMS
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl lg:text-2xl text-white/80 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide transition-all duration-500 delay-900 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Precision-engineered performance parts for riders who demand
            excellence
          </p>

          {/* CTA Button - Glassomorphic */}
          <div
            className={`transition-all duration-500 delay-1000 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={handleExploreClick}
              className="bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-white/10"
            >
              Explore Performance Parts
            </button>
          </div>

          {/* Secondary Glassomorphic Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mt-8 transition-all duration-500 delay-1200 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button className="bg-white/5 backdrop-blur-lg hover:bg-white/10 border border-white/15 text-white/90 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105">
              View Collections
            </button>
            <button className="bg-white/5 backdrop-blur-lg hover:bg-white/10 border border-white/15 text-white/90 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105">
              Custom Builds
            </button>
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
      <div className="relative z-10">
        <EditorialSection />
      </div>
      <div className="relative z-10">
        <ReviewsSection />
        <NewsletterCTA />
      </div>
    </div>
  );
}
