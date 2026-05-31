"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import FormInput from "@/components/auth/FormInput";
import SubmitButton from "@/components/auth/SubmitButton";
import AlertMessage from "@/components/auth/AlertMessage";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(decodeURIComponent(emailParam));
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);

    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (!data.ok) {
        setAlert({ type: "error", message: data.error });
      } else {
        setAlert({ type: "success", message: data.message });
        setTimeout(() => router.push("/auth"), 2000);
      }
    } catch {
      setAlert({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-1">Set a new password</h2>
          <p className="text-xs text-white/40">
            Enter the code sent to your email, then choose a new password.
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

          {/* Large centered OTP input */}
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-[10px] tracking-[0.3em] text-white/40 uppercase"
            >
              6-Digit Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-3xl tracking-[0.8em] text-white placeholder-white/15 outline-none transition focus:border-white/25 focus:bg-white/8 font-mono"
            />
          </div>

          <FormInput
            id="newPassword"
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
            required
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((p) => !p)}
          />

          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repeat your new password"
            required
          />

          {alert && <AlertMessage type={alert.type} message={alert.message} />}

          <SubmitButton
            isSubmitting={isSubmitting}
            text="Reset Password"
            loadingText="Resetting..."
          />
        </form>

        <div className="mt-5 space-y-2 text-center">
          <p className="text-xs text-white/30">
            Didn&apos;t receive a code?{" "}
            <Link
              href="/forgot-password"
              className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
            >
              Send again
            </Link>
          </p>
          <p className="text-xs text-white/30">
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
    </div>
  );
}

export default function ResetPasswordPage() {
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

      {/* Brand */}
      <div className="relative z-10 text-center mb-10">
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

      <div className="relative z-10">
        <Suspense
          fallback={
            <div className="w-full max-w-sm">
              <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 text-center">
                <div className="w-8 h-8 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
                  Loading
                </p>
              </div>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
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
