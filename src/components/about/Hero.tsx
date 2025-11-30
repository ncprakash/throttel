"use client";
export default function Hero() {
  return (
    <section className="relative rounded-3xl overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        <div className="p-8 lg:p-16">
          <h1 className="text-5xl font-extrabold leading-tight">
            Throttle — thoughtful bike accessories
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
              src="http://tfcustoms.in/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdklhtflzr%2Fimage%2Fupload%2Fv1764347595%2Fproducts%2Fcrtxzuzzlztjlimumgev.jpg&w=1920&q=75"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
