// components/InterleavedScrollExperience.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import CategoryGrid from './CategoryGrid';
import FeaturedCollections from './FeaturedCollection';
import FitmentFinder from './Fitmentfinder';
import USPStrip from './UspStrip';
import EditorialSection from './EditorialSection';
import ReviewsSection from './ReviewSection';
import NewsletterCTA from './NewsLetterCTA';

export default function InterleavedScrollExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  
  const frameCount = 7;

  const currentFrame = useCallback((index: number) => {
    return `/frames/render${index}.png`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not ready yet...');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    console.log('✓ Canvas initialized');

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      context.scale(dpr, dpr);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
    };

    setCanvasSize();

    const drawImage = (image: HTMLImageElement, scale: number = 1) => {
      const dpr = window.devicePixelRatio || 1;
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      const canvasWidth = canvas.width / dpr;
      const canvasHeight = canvas.height / dpr;
      const imgAspect = image.width / image.height;
      const canvasAspect = canvasWidth / canvasHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imgAspect > canvasAspect) {
        drawHeight = canvasHeight * scale;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasWidth * scale;
        drawHeight = drawWidth / imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = (canvasHeight - drawHeight) / 2;
      }
      
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Load images
    let loadedCount = 0;
    console.log(`🎬 Loading ${frameCount} images...`);
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / frameCount) * 100);
        setLoadProgress(progress);
        console.log(`✓ ${loadedCount}/${frameCount}: render${i}.png`);
        
        if (i === 1) drawImage(img, 0.85);
        
        if (loadedCount === frameCount) {
          console.log('🎉 All loaded!');
          setTimeout(() => setIsLoading(false), 400);
        }
      };
      img.onerror = () => {
        loadedCount++;
        console.error(`✗ Failed: render${i}.png`);
        if (loadedCount === frameCount) setIsLoading(false);
      };
      img.src = currentFrame(i);
      imagesRef.current[i - 1] = img;
    }

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setScrollProgress(progress);

      const section = Math.floor(progress * 7);
      setCurrentSection(section);

      const frameIndex = Math.min(Math.max(1, section + 1), frameCount);
      const img = imagesRef.current[frameIndex - 1];
      
      if (img && img.complete) {
        let scale = 1;
        if (frameIndex === 1) {
          const zoomProgress = Math.min(progress * 7, 1);
          scale = 0.85 + (zoomProgress * 0.35);
        }
        requestAnimationFrame(() => drawImage(img, scale));
      }
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [currentFrame]);

  const heroOpacity = Math.max(0, 1 - (scrollProgress * 7));

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle
                  cx="64" cy="64" r="58" fill="none" stroke="white" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - loadProgress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-3xl font-light">{loadProgress}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight text-white">
                THROTTLE
                <span className="block text-white/40 font-light text-2xl mt-2">FORGED CUSTOMS</span>
              </h1>
              <div className="h-px w-72 mx-auto bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
              <p className="text-white/60 text-sm font-light tracking-[0.3em] uppercase">Loading Performance</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - ALWAYS RENDERED */}
      <div ref={containerRef} className="relative bg-black" style={{ minHeight: '700vh' }}>
        {/* Fixed Canvas Background */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0"
        />

        {/* Hero Content - Render 1 */}
        <div 
          className="relative h-screen flex items-center justify-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="text-center px-6 max-w-5xl mx-auto relative z-10">
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
              Precision-engineered performance parts for riders who demand excellence
            </p>
          </div>
        </div>

        {/* Section 1: Category Grid - Shows with Render 2 */}
        <div className={`relative min-h-screen transition-opacity duration-700 ${currentSection >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <CategoryGrid />
        </div>

        {/* Section 2: Featured Collections - Shows with Render 3 */}
        <div className={`relative min-h-screen transition-opacity duration-700 ${currentSection >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <FeaturedCollections />
        </div>

        {/* Section 3: Fitment Finder - Shows with Render 4 */}
        <div className={`relative min-h-screen transition-opacity duration-700 ${currentSection >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <FitmentFinder />
        </div>

        {/* Section 4: USP Strip - Shows with Render 5 */}
        <div className={`relative transition-opacity duration-700 ${currentSection >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          <USPStrip />
        </div>

        {/* Section 5: Editorial - Shows with Render 6 */}
        <div className={`relative min-h-screen transition-opacity duration-700 ${currentSection >= 5 ? 'opacity-100' : 'opacity-0'}`}>
          <EditorialSection />
        </div>

        {/* Section 6: Reviews - Shows with Render 7 */}
        <div className={`relative transition-opacity duration-700 ${currentSection >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <ReviewsSection />
          <NewsletterCTA />
        </div>
      </div>
    </>
  );
}
