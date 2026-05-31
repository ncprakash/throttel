// components/EditorialSection.tsx
"use client";

import Link from "next/link";

export default function EditorialSection() {
  const specs = [
    { label: "Track-tested", sub: "Street-ready" },
    { label: "Precision CNC machined", sub: "±0.01mm tolerance" },
    { label: "OEM fit", sub: "Aftermarket soul" },
    { label: "100% Custom made", sub: "Zero compromise" },
  ];

  return (
    <section className="bg-black py-32 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-20">
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

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: editorial text + quote */}
          <div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-10 tracking-tight leading-[0.93]">
              Built for Riders,
              <br />
              <span className="text-white/20 font-thin">Engineered for</span>
              <br />
              Performance
            </h2>

            {/* Pull-quote */}
            <blockquote className="border-l-2 border-white/15 pl-6 mb-10">
              <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed italic">
                &ldquo;Every part we make starts with a rider&apos;s frustration
                and ends with their smile.&rdquo;
              </p>
            </blockquote>

            <p className="text-white/40 text-base font-light leading-relaxed mb-12 max-w-lg">
              We design and deliver premium aftermarket parts that balance
              precision engineering with real-world durability. From
              track-tested components to everyday upgrades, our mission is to
              help riders push limits safely and confidently.
            </p>

            {/* Text link with underline animation */}
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-white text-sm font-semibold uppercase tracking-[0.2em]"
            >
              <span className="relative">
                Learn More
                <span className="absolute -bottom-px left-0 w-full h-px bg-white/30 group-hover:bg-white transition-colors duration-300" />
              </span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300"
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

          {/* Right: spec list */}
          <div className="lg:pt-4">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-light mb-6">
              Engineering Specs
            </p>
            <ul className="divide-y divide-white/8">
              {specs.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-7 group cursor-default"
                >
                  <div>
                    <p className="text-white font-semibold text-lg leading-none mb-1.5 group-hover:text-white/80 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-white/25 text-xs font-light tracking-wider uppercase">
                      {item.sub}
                    </p>
                  </div>
                  <span className="text-white/15 group-hover:text-white/50 transition-colors duration-300 text-2xl font-thin">
                    →
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
