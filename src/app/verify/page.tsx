// app/auth/page.tsx
"use client";

import { useState } from "react";
import EnterOTP from "@/components/EnterOTP";

export default function VerifyPage() {
  return (
    <>
      <section className="min-h-screen w-full bg-transparent text-white flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-3xl transition-all duration-1000 opacity-100 translate-y-0">
          <EnterOTP />
        </div>
      </section>
    </>
  );
}
