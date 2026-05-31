// app/auth/page.tsx
import { Suspense } from "react";
import AuthClient from "./AuthClient";

function AuthLoadingFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-8">
        <div className="text-center">
          <div className="w-8 h-8 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
            Loading
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <section className="relative w-full bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-20 overflow-hidden">
      {/* Large background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[clamp(6rem,20vw,20rem)] font-black text-white/[0.02] tracking-[-0.05em] leading-none">
          TFC
        </span>
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Auth card */}
      <div className="relative z-10">
        <Suspense fallback={<AuthLoadingFallback />}>
          <AuthClient />
        </Suspense>
      </div>

      <p className="relative z-10 mt-8 text-center text-[10px] uppercase tracking-[0.4em] text-white/20">
        Protected by industry-grade encryption
      </p>
    </section>
  );
}
