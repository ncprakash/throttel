// components/BikesShowcase.tsx
'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const bikes = [
  { 
    id: 'royal-enfield',
    name: 'Royal Enfield', 
    tagline: 'Pure Motorcycling',
    description: 'British heritage meets Indian craftsmanship in timeless classics',
    image: 'https://images.unsplash.com/photo-1558980664-1db506751c6c?w=1200&q=80',
    established: '1901',
    origin: 'UK/India'
  },
  { 
    id: 'harley-davidson',
    name: 'Harley Davidson', 
    tagline: 'All for Freedom',
    description: 'Iconic American muscle and the sound of pure freedom',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    established: '1903',
    origin: 'USA'
  },
  { 
    id: 'ducati',
    name: 'Ducati', 
    tagline: 'Italian Excellence',
    description: 'Race-bred performance with unmistakable Italian design',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80',
    established: '1926',
    origin: 'Italy'
  },
  { 
    id: 'bmw',
    name: 'BMW Motorrad', 
    tagline: 'Make Life a Ride',
    description: 'German engineering precision for every journey',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200&q=80',
    established: '1923',
    origin: 'Germany'
  },
  { 
    id: 'triumph',
    name: 'Triumph', 
    tagline: 'For the Ride',
    description: 'Modern classics with British soul and character',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&q=80',
    established: '1902',
    origin: 'UK'
  },
  { 
    id: 'yamaha',
    name: 'Yamaha', 
    tagline: 'Revs Your Heart',
    description: 'Japanese innovation powering the thrill of riding',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&q=80',
    established: '1955',
    origin: 'Japan'
  },
  { 
    id: 'ktm',
    name: 'KTM', 
    tagline: 'Ready to Race',
    description: 'Austrian performance machines built for adrenaline',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&q=80',
    established: '1934',
    origin: 'Austria'
  },
  { 
    id: 'honda',
    name: 'Honda', 
    tagline: 'The Power of Dreams',
    description: 'Legendary reliability meets cutting-edge technology',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
    established: '1948',
    origin: 'Japan'
  },
];

export default function CategoryGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Main Slider */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} !bg-white/40 hover:!bg-white !w-12 !h-1 !rounded-none transition-all duration-300"></span>`;
          },
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="w-full h-full"
      >
        {bikes.map((bike, index) => (
          <SwiperSlide key={bike.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={bike.image}
                  alt={`${bike.name} motorcycle`}
                  fill
                  className="object-cover"
                  quality={90}
                  priority={index < 2}
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20 mb-6 animate-fade-in">
                    <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                      Est. {bike.established}
                    </span>
                    <span className="w-1 h-1 bg-white/60 rounded-full" />
                    <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                      {bike.origin}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-7xl md:text-8xl font-light text-white mb-4 tracking-tight animate-slide-up">
                    {bike.name}
                  </h1>

                  {/* Tagline */}
                  <p className="text-2xl md:text-3xl text-white/80 font-light mb-6 animate-slide-up animation-delay-100">
                    {bike.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-lg text-white/60 mb-8 max-w-xl animate-slide-up animation-delay-200">
                    {bike.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex gap-4 animate-slide-up animation-delay-300">
                    <button className="group px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 flex items-center gap-3">
                      <span>Explore Models</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
        {/* Counter */}
        <div className="text-white/60 font-mono text-sm">
          <span className="text-white text-2xl font-light">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          <span>{String(bikes.length).padStart(2, '0')}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button className="swiper-button-prev-custom w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="swiper-button-next-custom w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div 
          className="h-full bg-white transition-all duration-[4000ms] ease-linear"
          style={{
            width: activeIndex === bikes.length - 1 ? '100%' : `${((activeIndex + 1) / bikes.length) * 100}%`
          }}
        />
      </div>

      {/* Brand Grid Overlay - Top Right */}
      <div className="absolute top-8 right-8 z-20 flex gap-2">
        {bikes.map((bike, index) => (
          <button
            key={bike.id}
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`w-16 h-16 rounded-full border-2 transition-all duration-300 overflow-hidden ${
              activeIndex === index 
                ? 'border-white scale-110' 
                : 'border-white/20 hover:border-white/40 scale-100 opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={bike.image}
              alt={bike.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
