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
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

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
    <div className="w-full max-w-md">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight text-white hover:text-white/80 transition-colors">
            THROTTLE
          </Link>
          <p className="mt-3 text-sm text-white/70">Set a new password</p>
          <p className="mt-1 text-xs text-white/40">
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

          {/* OTP input with large centered digits style */}
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
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
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              required
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white placeholder-white/20 outline-none transition focus:border-white/40 focus:bg-white/10 font-mono"
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

        <p className="mt-4 text-center text-xs text-white/40">
          Didn&apos;t receive a code?{" "}
          <Link href="/forgot-password" className="text-white/70 hover:text-white underline transition-colors">
            Send again
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-white/40">
          Remember your password?{" "}
          <Link href="/auth" className="text-white/70 hover:text-white underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <section className="min-h-screen w-full bg-transparent text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-16">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center">
              <p className="text-white/50 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>

      <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-white/30">
        Protected by industry-grade encryption
      </p>

      <div className="mt-10 w-full">
        <Footer />
      </div>
    </section>
  );
}
