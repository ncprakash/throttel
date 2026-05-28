// app/page.tsx
"use client";

import Footer from "../components/Footer";
import BottomNav from "@/components/BottomNavbar";
import AuthPage from "./auth/page";
import InterleavedScrollExperience from "@/components/InterLeaved";
import DealerSection from "@/components/DealerSection";


const CONTENT_PAD_BOTTOM = 68; // px — match your BottomNav height if it's fixed

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white antialiased flex flex-col">
      {/* Page content grows and leaves room for a fixed bottom nav */}
      <div 
        className="flex-1 w-full"
        style={{ paddingBottom: `${CONTENT_PAD_BOTTOM}px` }}
      >
        {/* ---------- Hero & Scroll Experience ---------- */}
        <div className="relative w-full bg-black">
          <InterleavedScrollExperience />
        </div>

        {/* ---------- Auth Section (below the scroll experience) ---------- */}
        <div className="relative w-full bg-black z-10">
          <AuthPage />
        </div>

        {/* ---------- Dealer Section ---------- */}
        <div className="relative w-full bg-black z-10">
          <DealerSection />
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <Footer />

      {/* ---------- BottomNav (fixed) ---------- */}
      <BottomNav />
    </main>
  );
}