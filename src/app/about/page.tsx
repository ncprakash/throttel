"use client";

import Hero from "@/components/about/Hero";
import TeamGrid from "@/components/about/TeamGrid";
import Footer from "@/components/Footer";
import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Cinematic header strip */}
      <div className="w-full border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Throttle Forged Customs</span>
          <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Est. 2024</span>
        </div>
      </div>

      {/* Hero component */}
      <Hero />

      {/* Editorial hero headline */}
      <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-32">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="text-[clamp(6rem,18vw,18rem)] font-black text-white/[0.03] tracking-[-0.05em] leading-none">
            RIDERS
          </span>
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-black tracking-[-0.04em] leading-[0.9] uppercase">
            FORGED
            <br />
            <span className="text-white/30">BY</span>
            <br />
            RIDERS.
          </h2>
          <div className="mt-8 max-w-md ml-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
            <p className="text-sm text-white/60 leading-relaxed">
              TFC wasn&apos;t born in a boardroom — it started on the road. Two
              riding friends, connected by late-night rides and the constant
              hunt for better performance.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story — editorial asymmetric grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
          <article className="lg:col-span-5 bg-black p-10 flex flex-col justify-between min-h-[320px]">
            <div className="text-[6rem] font-black leading-none text-white/5 select-none">
              01
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                How we started
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                TFC wasn&apos;t born in a boardroom — it started on the road.
                Two riding friends, connected by late-night rides and the
                constant hunt for better performance, realised motorcycle parts
                were either overpriced or underwhelming. So we decided to change
                that.
              </p>
            </div>
          </article>

          <article className="lg:col-span-4 bg-black/50 p-10 flex flex-col justify-between border-l border-white/5 min-h-[320px]">
            <div className="text-[6rem] font-black leading-none text-white/5 select-none">
              02
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                What we build
              </h3>
              <ul className="space-y-2">
                {[
                  "Precision engineering",
                  "Real-world testing",
                  "Premium-grade materials",
                  "Rider-driven design",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/70"
                  >
                    <span className="w-1 h-1 bg-white/40 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="lg:col-span-3 bg-black p-10 flex flex-col justify-between border-l border-white/5 min-h-[320px]">
            <div className="text-[6rem] font-black leading-none text-white/5 select-none">
              03
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Our mission
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Create high-quality performance parts riders can afford —
                without compromising safety, performance, or style.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Products & Community */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-white/5 rounded-3xl overflow-hidden">
          <div className="bg-black p-10">
            <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-4">
              What we ship
            </p>
            <h4 className="text-xl font-bold mb-6">
              Small-batch, rider-tested performance parts
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                "CNC-machined performance",
                "Intake & airflow components",
                "Ergonomic upgrades & extenders",
                "Precision brackets & hardware",
              ].map((item) => (
                <div
                  key={item}
                  className="p-4 bg-white/[0.03] border border-white/5 rounded-xl text-xs text-white/70 leading-relaxed"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] p-10 border-t border-white/5">
            <h4 className="text-lg font-bold mb-2">Join product trials</h4>
            <p className="text-sm text-white/50 mb-5">
              Want to test a prototype? Apply for select regional trials.
            </p>
            <div className="flex gap-3">
              <input
                aria-label="email"
                placeholder="you@domain.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors"
              />
              <button className="px-5 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              title: "Sustainability",
              body: "We minimize packaging and prioritize recyclable materials. Small footprint, long life.",
            },
            {
              title: "Press & partners",
              body: "Featured in regional rider reviews and design spotlights. Interested partners can reach out via our contact channels.",
            },
            {
              title: "Why riders trust us",
              body: "We test parts on our own machines — if we wouldn't use it, we won't ship it.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="flex-1 bg-white/[0.02] border border-white/8 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors"
            >
              <h4 className="text-lg font-bold mb-3">{card.title}</h4>
              <p className="text-sm text-white/60 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team section */}
      <section className="border-t border-white/5 max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-3">
              The people
            </p>
            <h3 className="text-4xl font-black tracking-tight">
              Meet the team
            </h3>
          </div>
          <p className="text-sm text-white/50 max-w-xs sm:text-right">
            A compact crew — designers, engineers, riders. We ship small-batch
            quality.
          </p>
        </div>
        <TeamGrid />
      </section>

      <Footer />
    </div>
  );
}
