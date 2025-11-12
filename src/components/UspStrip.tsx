// components/USPStrip.tsx
export default function USPStrip() {
  const usps = [
    { 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
      text: 'Free Returns',
      subtext: '30 Day Guarantee'
    },
    { 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      text: 'Secure Checkout',
      subtext: 'SSL Encrypted'
    },
    { 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      text: 'Fast Shipping',
      subtext: 'Global Delivery'
    },
    { 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      text: 'Expert Support',
      subtext: '24/7 Available'
    },
  ];

  return (
    <section className="bg-white/[0.02] py-20 px-6 border-y border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {usps.map((usp, idx) => (
            <div key={idx} className="text-center group cursor-default">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/10 mb-5 group-hover:bg-white/10 group-hover:border-white/30 group-hover:scale-110 transition-all duration-500">
                <div className="text-white group-hover:scale-110 transition-transform duration-500">
                  {usp.icon}
                </div>
              </div>
              <h4 className="text-white font-semibold mb-1.5 text-sm md:text-base group-hover:text-white/90 transition-colors">
                {usp.text}
              </h4>
              <p className="text-white/50 text-xs md:text-sm font-light">
                {usp.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
