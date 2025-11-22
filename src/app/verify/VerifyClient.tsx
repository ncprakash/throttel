// app/verify/VerifyClient.tsx
"use client";

import React from "react";
import EnterOTP from "@/components/EnterOTP"; // uses useSearchParams internally

export default function VerifyClient() {
  return (
    <div className="w-full max-w-3xl">
      <EnterOTP />
    </div>
  );
}
