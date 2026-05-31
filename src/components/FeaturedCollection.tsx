"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  compatibility: boolean;
  compatibleWith: string[];
  isFeatured: boolean;
};

type CardProduct = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  link: string;
};

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function FeaturedCollections() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<CardProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products?limit=12");
        const data = (res.data.products || []) as ApiProduct[];

        const mapped: CardProduct[] = data.map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: p.compatibility
            ? `Compatible with ${p.compatibleWith.join(", ")}`
            : "Universal fit",
          description: p.description,
          price: formatINR(p.price),
          image: p.image || "/placeholder.jpg",
          link: `/product/${p.slug}`,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
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
    <section className="bg-black py-28 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">

        {/* Section header — editorial style */}
        <div className="flex items-end justify-between mb-16 relative">
          <div className="relative">
            {/* Large editorial number */}
            <span className="absolute -top-4 -left-1 text-[6rem] font-black text-white/[0.04] leading-none select-none pointer-events-none">
              01
            </span>
            <div className="relative inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
                Top Gear
              </span>
            </div>
            <h2 className="relative text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Featured Products
            </h2>
            <p className="relative text-white/40 text-lg font-light max-w-xl">
              Hand-picked performance items — tap a card to go to its product page.
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center group"
              aria-label="scroll left"
            >
              <svg
                className="w-4 h-4 text-white/40 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center group"
              aria-label="scroll right"
            >
              <svg
                className="w-4 h-4 text-white/40 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, idx) => (
            <article
              key={p.id}
              className="flex-none w-[85%] md:w-[calc(33.333%-12px)] snap-center"
              aria-roledescription="carouselitem"
            >
              <a
                href={p.link}
                className="group relative bg-white/[0.025] border border-white/8 hover:border-white/18 transition-all duration-700 block overflow-hidden h-[420px] flex flex-col"
                aria-label={`Open ${p.title} product page`}
              >
                {/* Top gradient border — lights on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

                {/* Product image — 60% of card height */}
                <div className="relative w-full h-[252px] flex-shrink-0 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                </div>

                {/* Content — 40% */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-[0.35em] mb-2 font-light">
                      {p.subtitle}
                    </p>
                    <h3 className="text-white text-[17px] font-bold leading-tight group-hover:text-white/80 transition-colors duration-500">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {/* Monospace price — bottom left */}
                    <span className="text-white/70 font-mono text-sm tracking-wider">
                      {p.price}
                    </span>
                    {/* Sliding arrow */}
                    <div className="flex items-center gap-1.5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                      <span className="text-[10px] tracking-[0.25em] uppercase font-light">View</span>
                      <span className="text-base leading-none">→</span>
                    </div>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Mobile indicator — thin lines */}
        <div className="flex justify-center items-center gap-2 mt-8 md:hidden">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-px transition-all duration-300 ${
                activeIndex === idx ? "w-8 bg-white" : "w-4 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
