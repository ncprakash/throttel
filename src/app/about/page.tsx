"use client";
import Hero from "@/components/about/Hero";
import CTA from "@/components/about/CTA";
import Philosophy from "@/components/about/Philosophy";
import ImagePanel from "@/components/about/ImagePanel";
import TeamGrid from "@/components/about/TeamGrid";
import Stats from "@/components/about/Stats";
import React, { useState } from "react";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [trialEmail, setTrialEmail] = useState("");
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialMessage, setTrialMessage] = useState<string | null>(null);
  const [trialError, setTrialError] = useState<string | null>(null);

  async function handleTrialSignup(e: React.FormEvent) {
    e.preventDefault();
    setTrialMessage(null);
    setTrialError(null);
    if (!trialEmail) return;

    setTrialLoading(true);
    try {
      const res = await fetch("/api/newsLetter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trialEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Subscription failed");
      }

      setTrialMessage(
        "Thanks for joining our product trials. Check your inbox."
      );
      setTrialEmail("");
    } catch (err: any) {
      setTrialError(err?.message || "Something went wrong. Try again.");
    } finally {
      setTrialLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden">
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 space-y-16">
        <Hero />

        <section className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Philosophy />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImagePanel
                title="Precision engineered"
                subtitle="Every mount, saddlebag and tool is prototyped, tested and tuned for lasting performance."
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop"
              />

              <ImagePanel
                title="Real riders, real testing"
                subtitle="We put gear through the conditions riders actually encounter — climbs, downpours, and long commutes."
                src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1400&auto=format&fit=crop"
              />
            </div>

            <Stats />

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">What we ship</h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                <li className="glass-panel bg-white/10 p-4 rounded-xl border border-white/8">
                  Alloy mounts & adapters
                </li>
                <li className="glass-panel bg-white/10 p-4 rounded-xl border border-white/8">
                  Waterproof saddle bags
                </li>
                <li className="glass-panel bg-white/10 p-4 rounded-xl border border-white/8">
                  Quick-release locks & tools
                </li>
                <li className="glass-panel bg-white/10 p-4 rounded-xl border border-white/8">
                  Lights & visibility kits
                </li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            {/* EMAIL → /api/newsletter */}
            <div className="glass-panel bg-white/10 p-6 rounded-2xl border border-white/8">
              <h4 className="text-lg font-semibold">Join product trials</h4>
              <p className="mt-3 text-white/70 text-sm">
                Want to test a prototype? Sign up and we'll reach out for select
                regional trials.
              </p>
              <form
                onSubmit={handleTrialSignup}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  aria-label="email"
                  placeholder="you@domain.com"
                  type="email"
                  required
                  value={trialEmail}
                  onChange={(e) => setTrialEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent border border-white/8 rounded-md text-white placeholder:text-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={trialLoading}
                  className="px-4 py-2 rounded-md backdrop-blur-sm bg-white/8 border border-white/12 disabled:opacity-60"
                >
                  {trialLoading ? "Applying..." : "Apply"}
                </button>
              </form>
              {trialMessage && (
                <p className="mt-2 text-xs text-green-400">{trialMessage}</p>
              )}
              {trialError && (
                <p className="mt-2 text-xs text-red-400">{trialError}</p>
              )}
            </div>

            <div className="glass-panel bg-white/10 p-6 rounded-2xl border border-white/8">
              <h4 className="text-lg font-semibold">Sustainability</h4>
              <p className="mt-2 text-white/70 text-sm">
                We minimize packaging and prioritize recyclable materials. Small
                footprint, long life.
              </p>
            </div>

            <div className="glass-panel bg-white/10 p-6 rounded-2xl border border-white/8">
              <h4 className="text-lg font-semibold">Press & partners</h4>
              <p className="mt-2 text-white/70 text-sm">
                Seen in urban rider reviews and design showcases across the
                region.
              </p>
            </div>
          </aside>
        </section>

        <section className="space-y-8">
          <h3 className="text-2xl font-semibold">Meet the team</h3>
          <p className="text-white/70">
            A compact crew — designers, engineers, riders. We ship small-batch
            quality.
          </p>

          <TeamGrid />
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
