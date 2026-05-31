// app/verify/page.tsx (server)
import React, { Suspense } from "react";
import Footer from "@/components/Footer";

const VerifyClient = React.lazy(() => import("./VerifyClient"));

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[clamp(5rem,20vw,20rem)] font-black text-white/[0.02] tracking-[-0.06em] leading-none">
          TFC
        </span>
      </div>

      {/* Brand strip */}
      <div className="relative z-10 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[10px] tracking-[0.4em] text-white/20 uppercase">
            Throttle Forged Customs
          </span>
          <span className="text-[10px] tracking-[0.4em] text-white/20 uppercase">
            Verification
          </span>
        </div>
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 w-full items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
              Account verification
            </p>
          </div>
          <Suspense
            fallback={
              <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center">
                <div className="w-8 h-8 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
                  Loading
                </p>
              </div>
            }
          >
            <VerifyClient />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full">
        <Footer />
      </footer>
    </main>
  );
}
