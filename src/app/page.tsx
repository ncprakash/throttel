// app/page.tsx - INTERLEAVED DESIGN

import InterleavedScrollExperience from "../components/InterLeaved";
import Footer from "../components/Footer";
import BottomNav from "@/components/BottomNavbar";
import AuthPage from "./auth/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      {/* Main Scroll Experience */}
      <div className="relative w-full">
        <InterleavedScrollExperience />
      </div>

      {/* Auth Section */}
      <div className="relative w-full bg-black">
        <AuthPage />
      </div>

      {/* Footer Section */}
      <div className="relative w-full bg-black border-t border-white/10">
        <Footer />
      </div>

      {/* Bottom Navigation - Fixed */}
      <BottomNav />
    </main>
  );
}
