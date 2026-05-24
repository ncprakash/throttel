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
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

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
    <section className="min-h-screen w-full bg-transparent text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight text-white hover:text-white/80 transition-colors">
              THROTTLE
            </Link>
            <p className="mt-3 text-sm text-white/70">Reset your password</p>
            <p className="mt-1 text-xs text-white/40">
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

            {alert && <AlertMessage type={alert.type} message={alert.message} />}

            <SubmitButton
              isSubmitting={isSubmitting}
              text="Send Reset Code"
              loadingText="Sending..."
            />
          </form>

          <p className="mt-6 text-center text-xs text-white/40">
            Remember your password?{" "}
            <Link href="/auth" className="text-white/70 hover:text-white underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-white/30">
        Protected by industry-grade encryption
      </p>

      <div className="mt-10 w-full">
        <Footer />
      </div>
    </section>
  );
}
