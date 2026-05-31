// components/ReviewsSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";

function StatCounter({
  target,
  suffix = "",
  decimals = 0,
  duration = 1800,
  label,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  label: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((eased * target).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals, duration]);

  return (
    <div className="text-center py-10 px-6 group" ref={ref}>
      <p className="text-5xl md:text-6xl font-black text-white mb-3 tabular-nums leading-none">
        {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}{suffix}
      </p>
      <p className="text-white/25 text-[10px] font-light uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
}

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Ankit Verma",
      bike: "Royal Enfield Hunter 350",
      rating: 5,
      text: "I was initially skeptical, but the air filter cap really complements my existing setup. Throttle response feels smoother and the bike breathes better without any issues. Clean design and perfect fit",
      verified: true,
    },
    {
      name: "Rahul Sharma",
      bike: "Royal Enfield Interceptor 650",
      rating: 5,
      text: "Installed the footpeg extenders on my Interceptor 650 and the difference was immediate. Long rides are way more comfortable now, especially for my pillion. Build quality feels solid and installation was straightforward. Totally worth it.",
      verified: true,
    },
    {
      name: "Suresh Iyer",
      bike: "Royal Enfield Continental GT 650",
      rating: 5,
      text: "Quality machining and proper finishing—no rough edges or fitment problems. I've done a few highway rides after installing this and everything feels more refined. Happy to support a brand that actually focuses on rider experience.",
      verified: true,
    },
    {
      name: "Rahul Mehta",
      bike: "Royal Enfield Continental GT 650",
      rating: 5,
      text: "The footpeg extender solved the pillion comfort issue on my Interceptor 650 instantly. Leg angle is much more relaxed now and long rides are no longer tiring. Solid build and perfect fit.",
      verified: true,
    },
    {
      name: "Amit Verma",
      bike: "Royal Enfield Himalayan 411",
      rating: 5,
      text: "Installed the air filter cap on my Himalayan 411 along with the stock filter. Throttle response feels cleaner and the bike breathes better, especially in mid-range. Fit and finish are top-notch",
      verified: true,
    },
    {
      name: "Sandeep Rao",
      bike: "Royal Enfield Scram 411",
      rating: 5,
      text: "Using this air filter cap on my Scram 411 for daily rides. No tuning needed, no issues at all. The bike feels smoother and slightly more responsive, plus it looks much better than stock.",
      verified: true,
    },
    {
      name: "Aditya",
      bike: "Royal Enfield Interceptor bear 650",
      rating: 5,
      text: "Installed the air filter cap on my Interceptor bear 650 with a stock air filter. The bike feels more free-revving and throttle response is noticeably smoother, especially in city riding. Clean fit and proper OEM-like finish.",
      verified: true,
    },
  ];

  return (
    <section className="bg-black py-32 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">

        {/* Section header with RIDERS watermark */}
        <div className="text-center mb-20 relative">
          {/* Watermark */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] md:text-[10rem] font-black text-white/[0.025] select-none pointer-events-none leading-none tracking-tighter whitespace-nowrap">
            RIDERS
          </span>

          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6 relative z-10">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
              Trusted Worldwide
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight relative z-10">
            Rider Reviews
          </h2>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto relative z-10">
            Join thousands of satisfied riders who trust us with their performance upgrades
          </p>
        </div>

        {/* Masonry layout via CSS columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 mb-16">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="break-inside-avoid mb-4 bg-white/[0.025] border border-white/8 hover:border-white/18 hover:bg-white/[0.04] transition-all duration-700 p-7"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-white/65 font-light leading-relaxed mb-6 text-[15px]">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer Info */}
              <div className="pt-5 border-t border-white/8 flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-semibold text-sm leading-none mb-1.5">{review.name}</p>
                  <p className="text-white/30 text-xs font-light">{review.bike}</p>
                </div>
                {review.verified && (
                  <div className="shrink-0 border border-white/15 px-2.5 py-1.5 flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-light">Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dramatic stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-white/10 divide-x divide-white/10 divide-y md:divide-y-0">
          <StatCounter target={4.9} decimals={1} suffix="" duration={1800} label="Average Rating" />
          <StatCounter target={1} suffix="K+" duration={1400} label="Reviews" />
          <StatCounter target={98} suffix="%" duration={1600} label="Satisfaction" />
          <StatCounter target={5} suffix="K+" duration={1600} label="Happy Riders" />
        </div>
      </div>
    </section>
  );
}
