// app/verify/page.tsx (server)
import React, { Suspense } from "react";
import Footer from "@/components/Footer";

const VerifyClient = React.lazy(() => import("./VerifyClient"));

export default function Page() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between bg-transparent px-4 sm:px-6 lg:px-12">
      
      {/* Centered content */}
      <div className="flex flex-1 w-full items-center justify-center py-16">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <Suspense fallback={<div className="text-white/60">Loading...</div>}>
            <VerifyClient />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full">
        <Footer />
      </footer>
    </main>
  );
}
