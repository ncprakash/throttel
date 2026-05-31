"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import FormInput from "@/components/auth/FormInput";
import SubmitButton from "@/components/auth/SubmitButton";
import AlertMessage from "@/components/auth/AlertMessage";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.ok) {
        setAlert({ type: "error", message: data.error });
      } else {
        setAlert({ type: "success", message: data.message });
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1800);
      }
    } catch {
      setAlert({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Large background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[clamp(4rem,20vw,20rem)] font-black text-white/[0.025] tracking-[-0.06em] leading-none">
          THROTTLE
        </span>
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-px h-8 bg-white/20 group-hover:bg-white/40 transition-colors" />
            <span className="text-2xl font-black tracking-[-0.04em] text-white group-hover:text-white/80 transition-colors">
              THROTTLE
            </span>
            <div className="w-px h-8 bg-white/20 group-hover:bg-white/40 transition-colors" />
          </Link>
          <p className="mt-4 text-xs text-white/40 tracking-[0.2em] uppercase">
            Password recovery
          </p>
        </div>

        <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-1">Reset your password</h2>
            <p className="text-xs text-white/40">
              Enter your email and we&apos;ll send a one-time code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
            />

            {alert && (
              <AlertMessage type={alert.type} message={alert.message} />
            )}

            <SubmitButton
              isSubmitting={isSubmitting}
              text="Send Reset Code"
              loadingText="Sending..."
            />
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            Remember your password?{" "}
            <Link
              href="/auth"
              className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <p className="relative z-10 mt-8 text-[10px] uppercase tracking-[0.4em] text-white/20">
        Protected by industry-grade encryption
      </p>

      <div className="relative z-10 mt-12 w-full">
        <Footer />
      </div>
    </section>
  );
}
