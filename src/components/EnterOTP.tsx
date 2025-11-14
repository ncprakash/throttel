"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  length?: number;
  onComplete?: (code: string) => void;
  onResend?: () => void;
  className?: string;
};

function OTPInput({ length = 6, onComplete, onResend, className = "" }: Props) {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Fixed: Get email from URL parameter named "otpemail"
  const email = searchParams.get("otpemail");

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    const code = values.join("");
    if (code.length === length && values.every((v) => v !== "")) {
      onComplete?.(code);
      handleVerify(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, length]);

  const handleChange = (index: number, val: string) => {
    const char = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...values];
    next[index] = char;
    setValues(next);

    if (char) {
      const nextInput = inputsRef.current[index + 1];
      nextInput?.focus();
      nextInput?.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    const key = e.key;
    if (key === "Backspace") {
      if (values[i]) {
        const next = [...values];
        next[i] = "";
        setValues(next);
      } else {
        const prev = inputsRef.current[i - 1];
        prev?.focus();
        prev?.select();
      }
    } else if (key === "ArrowLeft") {
      inputsRef.current[i - 1]?.focus();
    } else if (key === "ArrowRight") {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!paste) return;
    const next = Array(length).fill("");
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setValues(next);
    const focusIndex = Math.min(paste.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  async function handleVerify(code: string) {
    if (!code || code.length !== length) return;
    
    if (!email) {
      setError("Email not found in URL");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      const res = await axios.post("/api/verify-otp", { 
        otp: code,
        email: email 
      });

      if (res?.data?.ok || res?.status === 200) {
        setSuccess("Verification successful");
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        setError(res?.data?.message || "Verification failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.response?.data?.error || "Verification failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold tracking-tight">Enter verification code</h2>
        <p className="text-xs text-white/70">We sent a {length}-digit code to {email || "your email"}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleVerify(values.join("")); }} onPaste={handlePaste} className="flex gap-3 justify-center">
        {values.map((val, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 text-center text-lg font-medium outline-none focus:border-white/40 focus:bg-white/10"
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </form>

      <div className="mt-4 flex items-center justify-between text-xs">
        <button type="button" onClick={() => { setValues(Array(length).fill("")); inputsRef.current[0]?.focus(); onResend?.(); setError(null); setSuccess(null); }} className="text-sm font-medium text-white/70 hover:text-white/90">
          Resend code
        </button>
        <button type="button" onClick={() => handleVerify(values.join(""))} className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 disabled:opacity-50" disabled={values.some((v) => v === "") || isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
      </div>

      {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
      {success && <p className="mt-3 text-center text-sm text-green-400">{success}</p>}
    </div>
  );
}

export default OTPInput;
