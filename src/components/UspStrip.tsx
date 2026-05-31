// components/USPStrip.tsx
export default function USPStrip() {
  const usps = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      text: "Free Returns",
      subtext: "7 Day Guarantee",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: "Secure Checkout",
      subtext: "SSL Encrypted",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      text: "Fast Shipping",
      subtext: "Global Delivery",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      text: "Expert Support",
      subtext: "24/7 Available",
    },
  ];

  return (
    <section className="bg-black border-y border-white/10 overflow-hidden">
      {/* Mobile: marquee ticker */}
      <div className="md:hidden py-6">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...usps, ...usps].map((usp, idx) => (
            <div key={idx} className="inline-flex items-center gap-5 px-10 flex-none">
              <div className="w-9 h-9 border border-white/15 flex items-center justify-center shrink-0">
                <div className="text-white/50 w-5 h-5">{usp.icon}</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-white text-sm font-semibold tracking-wide">{usp.text}</span>
                <span className="text-white/35 text-xs font-light">{usp.subtext}</span>
              </div>
              <span className="text-white/10 ml-4 text-lg font-thin">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: divided grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 divide-x divide-white/8">
          {usps.map((usp, idx) => (
            <div
              key={idx}
              className="px-10 py-10 group cursor-default flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors duration-500"
            >
              {/* Square icon box */}
              <div className="w-11 h-11 border border-white/15 flex items-center justify-center mb-5 group-hover:border-white/40 transition-all duration-500">
                <div className="text-white/50 group-hover:text-white/80 transition-colors duration-500 w-5 h-5">
                  {usp.icon}
                </div>
              </div>
              {/* Fine vertical line connector */}
              <div className="w-px h-4 bg-white/8 mb-5" />
              <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                {usp.text}
              </h4>
              <p className="text-white/35 text-xs font-light tracking-wide">{usp.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
