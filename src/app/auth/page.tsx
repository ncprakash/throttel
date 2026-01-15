// app/auth/page.tsx
import { Suspense } from "react";
import AuthClient from "./AuthClient";
import Footer from "@/components/Footer";

function AuthLoadingFallback() {
  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-3xl transition-all duration-700">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            THROTTLE
          </h1>
          <p className="text-sm text-white/70">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <section className="min-h-screen w-full bg-transparent text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-16">
      
      {/* Auth Card */}
      <Suspense fallback={<AuthLoadingFallback />}>
        <AuthClient />
      </Suspense>

      {/* Security Note */}
      <p className="mt-6 sm:mt-8 text-center text-xs uppercase tracking-[0.3em] text-white/30">
        Protected by industry-grade encryption
      </p>

      {/* Footer */}
      <div className="mt-10 w-full">
        <Footer />
      </div>
    </section>
  );
}
