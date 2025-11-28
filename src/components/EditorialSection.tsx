// components/EditorialSection.tsx
"use client";

import Link from "next/link";

export default function EditorialSection() {
  return (
    <section className="bg-black py-32 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6 justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
            About
          </span>
        </div>

        {/* Title */}
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Built for Riders, Engineered for Performance
        </h2>

        {/* Description */}
        <p className="text-white/60 text-lg font-light max-w-2xl mx-auto leading-relaxed mb-10">
          We design and deliver premium aftermarket parts that balance precision
          engineering with real-world durability. From track-tested components
          to everyday upgrades, our mission is to help riders push limits safely
          and confidently.
        </p>

        {/* CTA */}
        <Link
          href="/about"
          className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all duration-300"
        >
          Learn More
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
