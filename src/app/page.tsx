// app/page.tsx
"use client";

import Image from "next/image";
import Footer from "../components/Footer";
import BottomNav from "@/components/BottomNavbar"; // adjust path if your file is named BottomNavbar
import AuthPage from "./auth/page";

import CategoryGrid from "../components/CategoryGrid";
import FeaturedCollections from "../components/FeaturedCollection";
import FitmentFinder from "../components/Fitmentfinder";
import USPStrip from "../components/UspStrip";
import EditorialSection from "../components/EditorialSection";
import ReviewsSection from "../components/ReviewSection";
import NewsletterCTA from "../components/NewsLetterCTA";

const CONTENT_PAD_BOTTOM = 68; // px — match your BottomNav height if it's fixed

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white antialiased flex flex-col">
      {/* Page content grows and leaves room for a fixed bottom nav */}
      <div
        className="relative w-full flex-grow"
        style={{ paddingBottom: CONTENT_PAD_BOTTOM }}
      >
        {/* ---------- Fixed Background (behind everything) ---------- */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="relative w-full h-[100dvh]">
            <Image
              src="/frames/render1.png"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>

        {/* ---------- Hero (full-screen) ---------- */}
        <section
          aria-label="Hero"
          className="relative h-screen flex items-center justify-center z-20"
        >
          <div className="text-center px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-8">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase">
                Race-Bred Performance Engineering
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
              <span className="text-white">THROTTLE</span>
              <span className="block text-white/30 font-light text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-tight">
                FORGED CUSTOMS
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
              Precision-engineered performance parts for riders who demand
              excellence
            </p>
          </div>
        </section>

        {/* ---------- Interleaved Content (sections) ---------- */}
        <main className="relative z-10">
          {/* Optional: category grid */}
          {/* <section className="relative min-h-screen z-10"><CategoryGrid /></section> */}

          <section className="relative min-h-screen z-10">
            <FeaturedCollections />
          </section>

          <section className="relative min-h-screen z-10">
            <FitmentFinder />
          </section>

          <section className="relative z-10">
            <USPStrip />
          </section>

          <section className="relative min-h-screen z-10">
            <EditorialSection />
          </section>

          <section className="relative z-10">
            <ReviewsSection />
            <NewsletterCTA />
          </section>
        </main>
      </div>

      {/* ---------- Auth Section (below the scroll experience) ---------- */}
      <div className="relative w-full bg-black z-10">
        <AuthPage />
      </div>

      {/* ---------- BottomNav (fixed) ---------- */}
      <BottomNav />

      {/* ---------- Footer ---------- */}
      <footer className="relative w-full bg-black border-t border-white/10 z-10">
        <Footer />
      </footer>
    </main>
  );
}
