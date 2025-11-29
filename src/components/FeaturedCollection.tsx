"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const products = [
  {
    id: "p1",
    title: "Guage",
    subtitle: "Lightweight Performance Exhaust",
    description: "this is a demo product",
    price: "₹250",
    // use the actual Cloudinary URL (not the internal _next/image optimizer URL)
    image:
      "https://res.cloudinary.com/dklhtflzr/image/upload/v1764347595/products/crtxzuzzlztjlimumgev.jpg",
    link: "/product/guage",
  },
  {
    id: "p2",
    title: "AeroGrip Racing Gloves",
    subtitle: "Pro-fit, Breathable",
    description:
      "Tactile palm, reinforced knuckles and touchscreen-friendly fingertips for track days.",
    price: "₹2,499",
    image: "/images/products/gloves.jpg",
    link: "/products/aerogrip-racing-gloves",
  },
  {
    id: "p3",
    title: "SwiftTrack Brake Pads",
    subtitle: "High Friction Compound",
    description:
      "Race-proven compound gives consistent bite and fade resistance under heavy use.",
    price: "₹4,199",
    image: "/images/products/brake-pads.jpg",
    link: "/products/swifttrack-brake-pads",
  },
];

export default function FeaturedCollections() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // keep active indicator in sync with scroll position
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.offsetWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((c, i) => {
        const rect = c.offsetLeft + c.offsetWidth / 2;
        const dist = Math.abs(center - rect);
        if (dist < closestDist) {
          closest = i;
          closestDist = dist;
        }
      });
      setActiveIndex(closest);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (idx: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[idx] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({ behavior: "smooth", inline: "center" });
    setActiveIndex(idx);
  };

  return (
    <section className="bg-white/0.02 py-32 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
                Top Gear
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Featured Products
            </h2>
            <p className="text-white/60 text-lg font-light max-w-xl">
              Hand-picked performance items — tap a card to go to its product
              page.
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center group"
              aria-label="scroll left"
            >
              <svg
                className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center group"
              aria-label="scroll right"
            >
              <svg
                className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, idx) => (
            <article
              key={p.id}
              className="flex-none w-[85%] md:w-[calc(33.333%-16px)] snap-center"
              aria-roledescription="carouselitem"
            >
              <a
                href={p.link}
                className="group relative bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-700 block h-full"
                aria-label={`Open ${p.title} product page`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute top-6 right-6">
                  <div className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full">
                    {p.price}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="w-full h-44 md:h-48 bg-white/6 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                    {/* image — replace with next/image if using Next.js */}
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={1200}
                      height={800}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-light">
                      {p.subtitle}
                    </p>
                    <h3 className="text-white text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-700">
                      {p.title}
                    </h3>
                    <p className="text-white/60 text-sm font-light leading-relaxed mb-4">
                      {p.description}
                    </p>
                    <div className="text-white/40 text-xs uppercase tracking-wider">
                      View product
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-2 mt-8 md:hidden">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "w-8 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
