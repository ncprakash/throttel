// components/InterleavedScrollExperience.tsx
"use client";
import CategoryGrid from "./CategoryGrid";
import FeaturedCollections from "./FeaturedCollection";
import FitmentFinder from "./Fitmentfinder";
import USPStrip from "./UspStrip";
import EditorialSection from "./EditorialSection";
import ReviewsSection from "./ReviewSection";
import NewsletterCTA from "./NewsLetterCTA";

export default function InterleavedScrollExperience() {
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
  <div className="absolute inset-0 bg-black/30" />
</div>





      {/* Hero Content */}
      <div className="relative h-screen flex items-center justify-center z-10">
        <div className="text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-10">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-white/90 text-xs font-light tracking-[0.3em] uppercase">
              Race-Bred Performance Engineering
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            <span className="text-white">THROTTLE</span>
            <span className="block text-white/30 font-light text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-tight">
              FORGED CUSTOMS
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-14 leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
            Precision-engineered performance parts for riders who demand
            excellence
          </p>
        </div>
      </div>
      {/* Section 1: Category Grid */}
      {/* <div className="relative min-h-screen z-10">
        <CategoryGrid />
      </div> */}

      {/* Section 2: Featured Collections */}
      <div className="relative min-h-screen z-10">
        <FeaturedCollections />
      </div>
      {/* Section 3: Fitment Finder */}
      <div className="relative min-h-screen z-10">
        <FitmentFinder />
      </div>
      {/* Section 4: USP Strip */}
      <div className="relative z-10">
        <USPStrip />
      </div>
      {/* Section 5: Editorial */}
      <div className="relative min-h-screen z-10">
        <EditorialSection />
      </div>
      {/* Section 6: Reviews */}
      <div className="relative z-10">
        <ReviewsSection />
        <NewsletterCTA />
      </div>
    </div>
  );
}
