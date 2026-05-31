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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
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
        email: email,
      });

      if (res?.data?.ok || res?.status === 200) {
        setSuccess("Verification successful");
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        setError(res?.data?.message || "Verification failed");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Verification failed"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Email not found in URL");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess("OTP resent successfully. Check your inbox (and spam folder).");
      } else {
        setError(data.error || data.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearOtp = () => {
    setValues(Array(length).fill(""));
    inputsRef.current[0]?.focus();
    setError(null);
    setSuccess(null);
    onResend?.();
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold tracking-tight">
          Enter verification code
        </h2>
        <p className="text-xs text-white/70">
          We sent a {length}-digit code to <strong>{email || "your email"}</strong>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify(values.join(""));
        }}
        onPaste={handlePaste}
        className="flex gap-3 justify-center"
      >
        {values.map((val, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 text-center text-lg font-medium outline-none focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/30"
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </form>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-xs">
        <button
          type="button"
          onClick={handleResend}
          disabled={loading || isSubmitting}
          className="w-full sm:w-auto text-sm font-medium text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Didn't receive? Resend code"}
        </button>
        <button
          type="submit"
          disabled={values.some((v) => v === "") || isSubmitting}
          className="w-full sm:w-auto rounded-lg bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 text-center text-sm text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/30">
          {success}
        </p>
      )}
    </div>
  );
}

export default OTPInput;
