// app/page.tsx
"use client";

import Footer from "../components/Footer";
import BottomNav from "@/components/BottomNavbar";
import AuthPage from "./auth/page";
import InterleavedScrollExperience from "@/components/InterLeaved";
import DealerSection from "@/components/DealerSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white antialiased flex flex-col">
      <div className="flex-1 w-full">
        <div className="relative w-full bg-black">
          <InterleavedScrollExperience />
        </div>

        <div className="relative w-full bg-black z-10">
          <DealerSection />
        </div>

        <div className="relative w-full bg-black z-10">
          <AuthPage />
        </div>
      </div>

      {/* Footer sits flush at the bottom; pb-20 clears the fixed BottomNav */}
      <div className="bg-black pb-20">
        <Footer />
      </div>

      <BottomNav />
    </main>
  );
}