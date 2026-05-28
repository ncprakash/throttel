"use client";

import { useEffect, useRef, useState } from "react";

const DEALER_PHONE = "9110610301";
const WHATSAPP_URL = `https://wa.me/91${DEALER_PHONE}?text=Hi%2C%20I%27m%20interested%20in%20becoming%20a%20TFC%20dealer.`;

const PERKS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Exclusive Pricing",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    label: "Fast Dispatch",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    label: "Premium Products",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    label: "Dealer Support",
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Orders Delivered" },
  { value: 20, suffix: "+", label: "Products" },
  { value: 100, suffix: "%", label: "Custom Made" },
];

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <>{count}{suffix}</>;
}

export default function DealerSection() {
  const { ref, inView } = useInView(0.2);
  const [hovered, setHovered] = useState(false);

  return (
    <section ref={ref} className="relative bg-black py-24 px-4 overflow-hidden">

      {/* Ambient glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-opacity duration-1000"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)", opacity: inView ? 0.18 : 0 }}
        />
        <div
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] transition-opacity duration-1000"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", opacity: inView ? 0.14 : 0 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* Top label */}
        <div
          className="flex justify-center mb-12 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white/70 text-xs font-light tracking-[0.3em] uppercase">Dealer Programme</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT ── */}
          <div className="space-y-8">

            {/* Heading */}
            <div
              className="transition-all duration-700 delay-100"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-40px)" }}
            >
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight uppercase">
                We&apos;re
                <br />
                <span className="text-white/30">Looking</span>
                <br />
                For Dealers
              </h2>
            </div>

            {/* Subtext */}
            <div
              className="transition-all duration-700 delay-200"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-40px)" }}
            >
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-md">
                Partner with Throttle Forged Customs and bring premium aftermarket
                performance parts to riders in your region.
              </p>
            </div>

            {/* Perk badges */}
            <div
              className="grid grid-cols-2 gap-3 transition-all duration-700 delay-300"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
            >
              {PERKS.map((p, i) => (
                <div
                  key={p.label}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="text-white/60">{p.icon}</span>
                  <span className="text-white/80 text-sm font-light">{p.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-[400ms]"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
            >
              {/* WhatsApp CTA */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="group relative inline-flex items-center gap-3 bg-white text-black font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
              >
                {/* Shimmer */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                {/* WhatsApp icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Become a Dealer
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>

              {/* Call CTA */}
              <a
                href={`tel:${DEALER_PHONE}`}
                className="group inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white/80 font-light text-sm tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {DEALER_PHONE.replace(/(\d{5})(\d{5})/, "$1 $2")}
              </a>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div
            className="relative transition-all duration-1000 delay-200"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0) scale(1)" : "translateX(40px) scale(0.97)" }}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/5 blur-sm" />

            {/* Main card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-xl">

              {/* Top strip */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <span className="text-white/40 text-xs tracking-widest uppercase font-light">TFC Partner Network</span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                {STATS.map((s, i) => (
                  <div key={s.label} className="py-6 px-4 text-center">
                    <p
                      className="text-3xl font-black text-white mb-1 tabular-nums transition-all duration-500"
                      style={{ transitionDelay: `${300 + i * 100}ms` }}
                    >
                      <AnimatedCounter target={s.value} suffix={s.suffix} inView={inView} />
                    </p>
                    <p className="text-white/40 text-xs font-light tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <p className="text-white/70 text-sm leading-relaxed font-light">
                  Join our growing dealer network and offer your customers India&apos;s
                  finest custom-engineered motorcycle performance parts — direct from the manufacturer.
                </p>

                {/* Benefit list */}
                <ul className="space-y-3">
                  {[
                    "Dealer-exclusive wholesale pricing",
                    "Direct WhatsApp order support",
                    "Custom branding options available",
                    "Priority stock allocation",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-white/70 font-light">
                      <span className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-2.5 h-2.5 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2 2 4-4" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Contact line */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/8">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-white/60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/30 text-xs font-light">Dealer enquiries</p>
                    <p className="text-white text-sm font-medium tracking-wide">
                      {DEALER_PHONE.replace(/(\d{5})(\d{5})/, "$1 $2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
