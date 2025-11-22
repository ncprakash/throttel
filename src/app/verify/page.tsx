// app/verify/page.tsx  (server)
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// dynamic import is optional; direct import also works because VerifyClient is client-only.
// Using direct import:
const VerifyClient = React.lazy(() => import("./VerifyClient"));

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20 px-6">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyClient />
      </Suspense>
    </main>
  );
}
