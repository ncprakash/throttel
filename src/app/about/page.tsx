"use client";

import Hero from "@/components/about/Hero";
import TeamGrid from "@/components/about/TeamGrid";
import Footer from "@/components/Footer";
import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden">
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 space-y-12">
        <Hero />

        {/* Card-based Brand Story */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
            <h3 className="text-xl font-semibold mb-3">How we started</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              TFC wasn’t born in a boardroom — it started on the road. Two
              riding friends, connected by late-night rides and the constant
              hunt for better performance, realised motorcycle parts were either
              overpriced or underwhelming. So we decided to change that.
            </p>
          </article>

          <article className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
            <h3 className="text-xl font-semibold mb-3">What we build</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              We design upgrades riders actually want — balancing premium
              materials with fair pricing and rugged real-world reliability.
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-1">
              <li>Precision engineering</li>
              <li>Real-world testing</li>
              <li>Premium-grade materials</li>
              <li>Rider-driven design</li>
            </ul>
          </article>

          <article className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
            <h3 className="text-xl font-semibold mb-3">Our mission</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Create high-quality performance parts that riders can afford —
              without compromising safety, performance, or style. Today, TFC is
              a rider-led community built on passion, loyalty, and the love for
              two wheels.
            </p>
          </article>
        </section>

        {/* Product & Community Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
              <h4 className="text-lg font-semibold">What we ship</h4>
              <p className="text-sm text-white/70 mt-2 mb-3">
                Small-batch, rider-tested performance parts:
              </p>
              <ul className="grid gap-2 sm:grid-cols-2 list-none">
                <li className="p-3 bg-white/5 rounded-lg">
                  CNC-machined performance
                </li>
                <li className="p-3 bg-white/5 rounded-lg">
                  Intake & airflow components
                </li>
                <li className="p-3 bg-white/5 rounded-lg">
                 Ergonomic upgrades & extenders
                </li>
                <li className="p-3 bg-white/5 rounded-lg">
                  Precision brackets, mounts & hardware
                </li>
              </ul>
            </div>

            <div className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
              <h4 className="text-lg font-semibold">Join product trials</h4>
              <p className="text-sm text-white/70 mt-2">
                Want to test a prototype? Apply for select regional trials.
              </p>
              <div className="mt-4 flex gap-3">
                <input
                  aria-label="email"
                  placeholder="you@domain.com"
                  className="flex-1 px-3 py-2 bg-transparent border border-white/8 rounded-md text-white placeholder:text-white/50 focus:outline-none"
                />
                <button className="px-4 py-2 rounded-md backdrop-blur-sm bg-white/8 border border-white/12">
                  Apply
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
              <h4 className="text-lg font-semibold">Sustainability</h4>
              <p className="mt-2 text-white/70 text-sm">
                We minimize packaging and prioritize recyclable materials. Small
                footprint, long life.
              </p>
            </div>

            <div className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
              <h4 className="text-lg font-semibold">Press & partners</h4>
              <p className="mt-2 text-white/70 text-sm">
                Featured in regional rider reviews and design spotlights.
                Interested partners can reach out via our contact channels.
              </p>
            </div>

            <div className="glass-panel bg-white/6 p-6 rounded-2xl border border-white/8 shadow-md">
              <h4 className="text-lg font-semibold">Why riders trust us</h4>
              <p className="mt-2 text-white/70 text-sm">
                We test parts on our own machines — if we wouldn't use it, we
                won't ship it.
              </p>
            </div>
          </aside>
        </section>

        {/* Team */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold">Meet the team</h3>
          <p className="text-white/70">
            A compact crew — designers, engineers, riders. We ship small-batch
            quality.
          </p>

          <TeamGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
