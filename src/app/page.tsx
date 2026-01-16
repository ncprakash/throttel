// app/page.tsx
"use client";

import Image from "next/image";
import Footer from "../components/Footer";
import BottomNav from "@/components/BottomNavbar"; // adjust path if your file is named BottomNavbar
import AuthPage from "./auth/page";
import InterleavedScrollExperience from "@/components/InterLeaved";


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
      </div>

      {/* ---------- BottomNav (fixed) ---------- */}
      <BottomNav />

      {/* ---------- Footer ---------- */}
      <footer className="relative w-full bg-black border-t border-white/10 z-10">
       =
      </footer>
    </main>
  );
}