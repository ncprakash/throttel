// app/page.tsx - INTERLEAVED DESIGN

import InterleavedScrollExperience from "../components/InterLeaved";
import Footer from "../components/Footer";
import BottomNav from "@/components/BottomNavbar";

import AuthPage from "./auth/page";

export default function Home() {
  return (
    <>
      <BottomNav />
      <InterleavedScrollExperience />
      <Footer />
    <AuthPage/>
    </>
  );
}
