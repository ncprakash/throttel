// components/ScrollRender.tsx - START FULL, ZOOM IN ON SCROLL
'use client';
import { useEffect, useRef, useState, useCallback, ReactNode } from 'react';

interface ScrollRenderProps {
  frameCount?: number;
  containerHeight?: string;
  className?: string;
  children?: ReactNode;
}

export default function ScrollRender({ 
  frameCount = 7,
  containerHeight = '500vh',
  className = '',
  children
}: ScrollRenderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const currentFrame = useCallback((index: number) => {
    return `/frames/render${index}.png`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const context = canvas.getContext('2d');
    if (!context) return;

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
      
      // Cover fit - image fills entire canvas
      if (imgAspect > canvasAspect) {
        // Image is wider - fit to height
        drawHeight = canvasHeight * scale;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        // Image is taller - fit to width
        drawWidth = canvasWidth * scale;
        drawHeight = drawWidth / imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = (canvasHeight - drawHeight) / 2;
      }
      
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    let loadedCount = 0;
    const totalImages = frameCount;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      
      img.onload = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / totalImages) * 100);
        setLoadProgress(progress);
        
        if (i === 1) {
          // Draw first frame at 0.85x - SHOWS FULL IMAGE with breathing room
          drawImage(img, 0.85);
        }
        
        if (loadedCount === totalImages) {
          setTimeout(() => setIsLoading(false), 400);
        }
      };
      
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setIsLoading(false);
        }
      };
      
      img.src = currentFrame(i);
      imagesRef.current[i - 1] = img;
    }

    const updateImage = (index: number, progress: number) => {
      const frameIndex = Math.max(1, Math.min(frameCount, index));
      setCurrentFrameIndex(frameIndex);
      
      const img = imagesRef.current[frameIndex - 1];
      if (img && img.complete) {
        // ZOOM IN effect on first frame (0-20% scroll)
        // Starts at 0.85x (full view with space), ZOOMS IN to 1.2x
        let scale = 1;
        if (frameIndex === 1) {
          const zoomProgress = Math.min(progress * 5, 1); // 0-1 over first 20%
          scale = 0.85 + (zoomProgress * 0.35); // 0.85 -> 1.2 (dramatic zoom in)
        }
        
        requestAnimationFrame(() => drawImage(img, scale));
      }
    };

    const handleScroll = () => {
      if (!isInView || !container) return;
      
      const rect = container.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setScrollProgress(progress);
      
      const frameIndex = Math.max(1, Math.ceil(progress * frameCount) || 1);
      updateImage(frameIndex, progress);
    };

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(container);

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
      observer.disconnect();
    };
  }, [frameCount, currentFrame, isInView]);

  // Hide hero content after 15% scroll
  const heroOpacity = Math.max(0, 1 - (scrollProgress * 6.67));

  return (
    <>
      {/* Loading Overlay */}
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
              <p className="text-white/60 text-sm font-light tracking-[0.3em] uppercase">
                Loading Performance
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        ref={containerRef}
        className={`relative w-full bg-black ${className}`}
        style={{ height: containerHeight }}
      >
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0"
        />

        {/* Vignette */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div 
            className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-black via-black/60 to-transparent transition-opacity duration-500"
            style={{ opacity: Math.min(1, scrollProgress * 3) }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black via-black/90 to-transparent transition-opacity duration-500"
            style={{ opacity: Math.min(1, scrollProgress * 3) }}
          />
        </div>

        {/* Hero Content Overlay */}
        <div 
          style={{ opacity: heroOpacity }}
          className="transition-opacity duration-500"
        >
          {children}
        </div>

        {/* Scroll Progress (appears after hero fades) */}
        {scrollProgress > 0.15 && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 animate-fadeIn">
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center space-y-1.5">
                <p className="text-white text-xs font-semibold tracking-[0.4em] uppercase">Explore</p>
                <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase">Performance</p>
              </div>
              
              <div className="relative">
                <div className="w-px h-36 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="w-full bg-white transition-all duration-200"
                    style={{ height: `${(currentFrameIndex / frameCount) * 100}%` }}
                  />
                </div>
                <div 
                  className="absolute left-1/2 w-2.5 h-2.5 bg-white rounded-full transition-all duration-200 shadow-lg shadow-white/50"
                  style={{ 
                    top: `${(currentFrameIndex / frameCount) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>

              <div className="text-white/50 text-xs font-mono">
                {String(currentFrameIndex).padStart(2, '0')} / {String(frameCount).padStart(2, '0')}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
