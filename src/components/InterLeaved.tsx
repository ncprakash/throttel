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
        {/* Static Background Image */}
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

        {/* Hero Content — Immediately visible */}
        <div className="relative h-screen flex flex-col items-center justify-center z-10">
          <div className="text-center px-6 max-w-5xl mx-auto opacity-100 translate-y-0">

            {/* Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/20 mb-10 opacity-100 translate-y-0">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase">
                Race-Bred Performance Engineering
              </span>
            </div>

            {/* Main title with layered depth */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              <span className="relative inline-block">
                {/* Ghost stroke layer for depth */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 text-transparent select-none pointer-events-none leading-none"
                  style={{ WebkitTextStroke: "1px rgba(255,255,255,0.10)" }}
                >
                  THROTTLE
                </span>
                <span className="relative text-white opacity-100">THROTTLE</span>
              </span>
              <span className="block text-white/20 font-thin text-3xl sm:text-4xl lg:text-5xl mt-4 tracking-[0.35em] uppercase opacity-100 translate-y-0">
                FORGED CUSTOMS
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide opacity-100 translate-y-0">
              Precision-engineered performance parts for riders who demand excellence
            </p>

            {/* Single CTA Button */}
            <div className="opacity-100 translate-y-0">
              <button
                onClick={handleExploreClick}
                className="bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 hover:border-white/50 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
              >
                Explore Performance Parts
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60">
            <span className="text-white/50 text-[10px] tracking-[0.4em] uppercase font-light">Scroll</span>
            <svg
              className="w-4 h-4 text-white/40 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
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
      {/* Static Background Image */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <Image
          src="/frames/render1.png"
          alt=""
          fill
          className="absolute inset-0 w-full h-full object-cover -z-10 bg-image-stabilize subtle-zoom-onload"
          style={{ transform: "translateZ(0)" }}
          loading="eager"
        />

        {/* Reduced base tint */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Loading overlay during initial sequence */}
        {stage < 4 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">

            {/* Scanlines texture */}
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
              }}
            />

            {/* TFC Monogram — replaces gear icon */}
            <div
              className="relative z-20 transition-all duration-500 mb-10"
              style={{
                opacity: stage >= 1 ? 1 : 0,
                transform: `scale(${
                  stage >= 1 ? 1 : 0.8
                }) rotate(${gearRotation}deg)`,
              }}
            >
              <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
                <circle cx="46" cy="46" r="44" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <circle cx="46" cy="46" r="36" stroke="white" strokeWidth="1" opacity="0.35" />
                <circle cx="46" cy="46" r="28" stroke="white" strokeWidth="0.5" opacity="0.15" />
                <text
                  x="46"
                  y="46"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="14"
                  fontWeight="900"
                  letterSpacing="5"
                  fontFamily="system-ui, sans-serif"
                >
                  TFC
                </text>
              </svg>
            </div>

            {/* Percentage display — unchanged */}
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
              <div className="w-48 sm:w-64 h-px bg-white/15 mt-6 mx-auto overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-200 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* RPM-style indicators */}
              <div className="flex justify-between w-48 sm:w-64 mx-auto mt-2">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div key={mark} className="text-xs text-white/30 font-mono">
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

        {/* Final background state */}
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
      <div className="relative h-screen flex flex-col items-center justify-center z-10">
        <div
          className={`text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${
            showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
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

          {/* Main title with depth */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            <span className="relative inline-block">
              {/* Ghost stroke layer */}
              <span
                aria-hidden="true"
                className="absolute inset-0 text-transparent select-none pointer-events-none leading-none"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.10)" }}
              >
                THROTTLE
              </span>
              <span
                className={`relative text-white inline-block transition-all duration-500 delay-500 ${
                  textReveal ? "opacity-100" : "opacity-0"
                }`}
              >
                THROTTLE
              </span>
            </span>
            <span
              className={`block text-white/20 font-thin text-3xl sm:text-4xl lg:text-5xl mt-4 tracking-[0.35em] uppercase transition-all duration-500 delay-700 ${
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
            className={`text-lg sm:text-xl lg:text-2xl text-white/70 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide transition-all duration-500 delay-900 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Precision-engineered performance parts for riders who demand excellence
          </p>

          {/* Single CTA Button */}
          <div
            className={`transition-all duration-500 delay-1000 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={handleExploreClick}
              className="bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 hover:border-white/50 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            >
              Explore Performance Parts
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 delay-[1400ms] ${
            showHero ? "opacity-60" : "opacity-0"
          }`}
        >
          <span className="text-white/50 text-[10px] tracking-[0.4em] uppercase font-light">Scroll</span>
          <svg
            className="w-4 h-4 text-white/40 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
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
