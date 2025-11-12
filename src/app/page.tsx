// app/page.tsx - INTERLEAVED DESIGN

import InterleavedScrollExperience from '../components/InterLeaved'
import Footer from '../components/Footer';
import BottomNav from '@/components/BottomNavbar';

export default function Home() {
  return (
    <>
      <BottomNav/>
      <InterleavedScrollExperience />
      <Footer />
    </>
  );
}
