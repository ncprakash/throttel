"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsLetter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Subscription failed");
      }
      setMsg("Subscribed successfully. Check your inbox.");
      setEmail("");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel bg-white/10 p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h4 className="text-lg font-semibold">Ride better. Gear smarter.</h4>
        <p className="mt-2 text-white/70">
          Subscribe for product drops, maintenance tips and seasonal offers.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <input
          aria-label="Email"
          type="email"
          placeholder="you@domain.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 bg-transparent border border-white/8 rounded-md text-white placeholder:text-white/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md backdrop-blur-sm bg-white/8 border border-white/12 disabled:opacity-60"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {msg && <p className="mt-2 text-xs text-green-400">{msg}</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
