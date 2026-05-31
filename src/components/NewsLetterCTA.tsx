'use client';
import { useState } from 'react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsLetter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(true);
        setTimeout(() => {
          setEmail('');
          setSubscribed(false);
        }, 4000);
      } else {
        setError(data.error || 'Subscription failed');
      }
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black py-32 px-6 relative overflow-hidden border-t border-white/10">
      {/* Large typographic background element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[22vw] font-black text-white/[0.022] leading-none tracking-tighter">
          TFC
        </span>
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
            Join The Community
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
          The Throttle Club
        </h2>
        <p className="text-white/40 text-lg font-light mb-14 leading-relaxed">
          Exclusive access to new releases, performance tips, pro rider
          insights, and member-only offers
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubmit} className="mb-10">
            {/* Underline-style input */}
            <div className="relative flex items-center border-b border-white/15 pb-1 focus-within:border-white/50 transition-colors duration-300 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading}
                className="flex-1 bg-transparent text-white text-base font-light py-4 focus:outline-none placeholder:text-white/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Subscribe"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p className="text-white/40 text-xs mt-2 text-left">{error}</p>
            )}
          </form>
        ) : (
          <div className="mb-10 py-6">
            <div className="flex items-center justify-center space-x-3 text-white/70">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-light text-sm">Welcome to the club. Check your inbox.</span>
            </div>
          </div>
        )}

        {/* Trust badges — inline, refined */}
        <div className="flex flex-wrap justify-center gap-6 text-[11px] text-white/20 font-light tracking-wider uppercase">
          <span>No spam, ever</span>
          <span className="text-white/10">·</span>
          <span>Unsubscribe anytime</span>
          <span className="text-white/10">·</span>
          <span>Privacy protected</span>
        </div>
      </div>
    </section>
  );
}
