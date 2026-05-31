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

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function InterleavedScrollExperience() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [gearRotation, setGearRotation] = useState(0);
  const [textReveal, setTextReveal] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleExploreClick = () => { router.push("/shop"); };

  // Scroll tracker for objectPosition parallax
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const alreadyAnimated = sessionStorage.getItem("throttle-animation-shown");
    sessionStorage.setItem("throttle-animation-shown", "true");

    if (alreadyAnimated) {
      setHasAnimated(true);
      setStage(4);
      setPercentage(100);
      setTextReveal(true);
      setShowHero(true);
      return;
    }

    audioRef.current = new Audio("/sounds/gear-engage.mp3");
    audioRef.current.volume = 0.3;

    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

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

      await new Promise((resolve) => setTimeout(resolve, 200));

      const countDuration = 1200;
      const startTime = Date.now();

      const animateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / countDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        const currentPercentage = Math.min(Math.floor(eased * 100), 100);
        setPercentage(currentPercentage);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setStage(3);
          setTimeout(() => {
            setTextReveal(true);
            setTimeout(() => {
              setStage(4);
              setShowHero(true);
              setHasAnimated(true);
              localStorage.setItem("throttle-animation-shown", "true");
            }, 800);
          }, 300);
        }
      };

      animateCount();
    };

    sequence();
  }, []);

  // objectPosition parallax — shifts which part of the image is visible,
  // no wrapper zoom. Caps at 25% so the top of the image never fully disappears.
  const objPos = Math.max(25, 50 - scrollY * 0.014);

  // ─── Render path 1: animation already shown ───────────────────────────────
  if (hasAnimated) {
    return (
      <div className="relative bg-transparent">
        {/* Background — full natural size, objectPosition parallax */}
        <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
          <Image
            src="/frames/render1.png"
            alt=""
            fill
            className="object-cover bg-image-stabilize"
            style={{
              objectPosition: `center ${objPos}%`,
              transform: "translateZ(0)",
            }}
            loading="eager"
          />
          {/* Film grain */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] animate-grain"
            style={{ backgroundImage: GRAIN_BG, backgroundSize: "200px 200px" }}
          />
          {/* Gradient overlay — keeps top of image visible, darkens towards bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/55" />
        </div>

        {/* Hero */}
        <div className="relative h-screen flex flex-col items-center justify-center z-10">
          {/* Bottom blend gradient — smoothly dissolves hero into first content section */}
          <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black via-black/65 to-transparent pointer-events-none z-0" />

          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-white/15 opacity-60 z-10" />
          <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-white/15 opacity-60 z-10" />
          <div className="absolute bottom-16 left-8 w-10 h-10 border-b border-l border-white/15 opacity-60 z-10" />
          <div className="absolute bottom-16 right-8 w-10 h-10 border-b border-r border-white/15 opacity-60 z-10" />

          {/* One-time scan line */}
          <div className="animate-scan-down bg-gradient-to-r from-transparent via-white/15 to-transparent z-20" />

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            {/* Badge with shimmer */}
            <div className="relative inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/20 mb-10 overflow-hidden">
              <div
                className="absolute inset-y-0 w-1/3 animate-shimmer-slide pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }}
              />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse relative z-10" />
              <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase relative z-10">
                Race-Bred Performance Engineering
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 text-transparent select-none pointer-events-none leading-none"
                  style={{ WebkitTextStroke: "1px rgba(255,255,255,0.10)" }}
                >
                  THROTTLE
                </span>
                <span className="relative text-white opacity-100">THROTTLE</span>
              </span>
              <span className="block text-white/20 font-thin text-3xl sm:text-4xl lg:text-5xl mt-4 tracking-[0.35em] uppercase opacity-100">
                FORGED CUSTOMS
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
              Precision-engineered performance parts for riders who demand excellence
            </p>

            <button
              onClick={handleExploreClick}
              className="bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 hover:border-white/50 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            >
              Explore Performance Parts
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 z-10">
            <span className="text-white/50 text-[10px] tracking-[0.4em] uppercase font-light">Scroll</span>
            <svg className="w-4 h-4 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sections */}
        <div className="relative min-h-screen z-10"><FeaturedCollections /></div>
        <div className="relative min-h-screen z-10"><FitmentFinder /></div>
        <div className="relative z-10"><USPStrip /></div>
        <div className="relative min-h-screen z-10"><EditorialSection /></div>
        <div className="relative z-10">
          <ReviewsSection />
          <NewsletterCTA />
        </div>
      </div>
    );
  }

  // ─── Render path 2: first visit with animation ────────────────────────────
  return (
    <div className="relative bg-transparent">
      {/* Background — full natural size, objectPosition parallax */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <Image
          src="/frames/render1.png"
          alt=""
          fill
          className="object-cover bg-image-stabilize"
          style={{
            objectPosition: `center ${objPos}%`,
            transform: "translateZ(0)",
          }}
          loading="eager"
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] animate-grain"
          style={{ backgroundImage: GRAIN_BG, backgroundSize: "200px 200px" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/55" />

        {/* Loading overlay */}
        {stage < 4 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            {/* Scanlines during load */}
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
              }}
            />

            {/* TFC Monogram */}
            <div
              className="relative z-20 transition-all duration-500 mb-10"
              style={{
                opacity: stage >= 1 ? 1 : 0,
                transform: `scale(${stage >= 1 ? 1 : 0.8}) rotate(${gearRotation}deg)`,
              }}
            >
              <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
                <circle cx="46" cy="46" r="44" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <circle cx="46" cy="46" r="36" stroke="white" strokeWidth="1" opacity="0.35" />
                <circle cx="46" cy="46" r="28" stroke="white" strokeWidth="0.5" opacity="0.15" />
                <text
                  x="46" y="46"
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

            {/* Percentage display */}
            <div
              className="relative z-20 text-center transition-all duration-300"
              style={{
                opacity: stage >= 2 ? 1 : 0,
                transform: `scale(${stage >= 2 ? 1 : 0.9})`,
              }}
            >
              <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 font-mono">
                {percentage}%
              </div>
              <div className="text-white/70 text-sm sm:text-base uppercase tracking-widest font-light">
                {percentage < 100 ? "Throttle Engaged" : "Systems Online"}
              </div>
              <div className="w-48 sm:w-64 h-px bg-white/15 mt-6 mx-auto overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-200 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between w-48 sm:w-64 mx-auto mt-2">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div key={mark} className="text-xs text-white/30 font-mono">{mark}</div>
                ))}
              </div>
            </div>

            {/* Fade reveal overlay */}
            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{ backgroundColor: `rgba(0,0,0,${0.7 - (percentage / 100) * 0.7})` }}
            />
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="relative h-screen flex flex-col items-center justify-center z-10">
        {/* Bottom blend gradient — smooth dissolve into FeaturedCollections */}
        <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black via-black/65 to-transparent pointer-events-none z-0" />

        {/* Corner brackets — fade in with hero */}
        <div className={`absolute top-8 left-8 w-10 h-10 border-t border-l border-white/15 transition-all duration-1000 delay-[900ms] z-10 ${showHero ? "opacity-60" : "opacity-0"}`} />
        <div className={`absolute top-8 right-8 w-10 h-10 border-t border-r border-white/15 transition-all duration-1000 delay-[900ms] z-10 ${showHero ? "opacity-60" : "opacity-0"}`} />
        <div className={`absolute bottom-16 left-8 w-10 h-10 border-b border-l border-white/15 transition-all duration-1000 delay-[900ms] z-10 ${showHero ? "opacity-60" : "opacity-0"}`} />
        <div className={`absolute bottom-16 right-8 w-10 h-10 border-b border-r border-white/15 transition-all duration-1000 delay-[900ms] z-10 ${showHero ? "opacity-60" : "opacity-0"}`} />

        {/* One-time scan line */}
        {showHero && (
          <div className="animate-scan-down bg-gradient-to-r from-transparent via-white/15 to-transparent z-20" />
        )}

        <div
          className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${
            showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge with shimmer */}
          <div
            className={`relative inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/20 mb-10 overflow-hidden transition-all duration-700 delay-300 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div
              className="absolute inset-y-0 w-1/3 animate-shimmer-slide pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }}
            />
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse relative z-10" />
            <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase relative z-10">
              Race-Bred Performance Engineering
            </span>
          </div>

          {/* Title with ghost stroke */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            <span className="relative inline-block">
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
                textReveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              FORGED CUSTOMS
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl lg:text-2xl text-white/70 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide transition-all duration-500 delay-900 ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Precision-engineered performance parts for riders who demand excellence
          </p>

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
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 delay-[1400ms] z-10 ${
            showHero ? "opacity-60" : "opacity-0"
          }`}
        >
          <span className="text-white/50 text-[10px] tracking-[0.4em] uppercase font-light">Scroll</span>
          <svg className="w-4 h-4 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Sections */}
      <div className="relative min-h-screen z-10"><FeaturedCollections /></div>
      <div className="relative min-h-screen z-10"><FitmentFinder /></div>
      <div className="relative z-10"><USPStrip /></div>
      <div className="relative z-10"><EditorialSection /></div>
      <div className="relative z-10">
        <ReviewsSection />
        <NewsletterCTA />
      </div>
    </div>
  );
}
