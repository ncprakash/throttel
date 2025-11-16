export default function CTA() {
  return (
    <div className="glass-panel bg-white/10 p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h4 className="text-lg font-semibold">Ride better. Gear smarter.</h4>
        <p className="mt-2 text-white/70">
          Subscribe for product drops, maintenance tips and seasonal offers.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <input
          aria-label="Email"
          type="email"
          placeholder="you@domain.com"
          className="px-4 py-2 bg-transparent border border-white/8 rounded-md text-white placeholder:text-white/50 focus:outline-none"
        />
        <button className="px-4 py-2 rounded-md backdrop-blur-sm bg-white/8 border border-white/12">
          Subscribe
        </button>
      </div>
    </div>
  );
}
