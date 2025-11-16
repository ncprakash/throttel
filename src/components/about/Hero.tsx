"use client";
export default function Hero() {
  return (
    <section className="relative rounded-3xl overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        <div className="p-8 lg:p-16">
          <h1 className="text-5xl font-extrabold leading-tight">
            Throttel — thoughtful bike accessories
          </h1>
          <p className="mt-4 text-white/70 max-w-xl">
            Minimal, durable and engineered for the ride. We make accessories
            that disappear into the experience — until you need them.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/shop"
              className="inline-flex items-center px-5 py-3 rounded-lg backdrop-blur-sm bg-white/8 border border-white/12 font-semibold"
            >
              Shop gear
            </a>
            <a
              href="#team"
              className="inline-flex items-center px-5 py-3 rounded-lg border border-white/8 text-sm text-white/70"
            >
              Meet the team
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="w-full h-full bg-white/4 flex items-center justify-center">
            <img
              alt="bike accessories"
              src="https://images.unsplash.com/photo-1518173946681-a56b1a4c6c9b?q=80&w=1200&auto=format&fit=crop"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
