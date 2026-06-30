// components/auth/SignInForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import AlertMessage from "./AlertMessage";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    identifier: "", // email or phone
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credentials = {
        email: formData.identifier.trim(),
        password: formData.password,
      };

      // NextAuth signIn
      const res = await signIn("credentials", {
        redirect: false,
        ...credentials,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        console.log(res);
        // Check for callbackUrl parameter, otherwise redirect to profile
        let redirectUrl = "/profile";
        const callbackUrl = searchParams.get("callbackUrl");
        
        if (callbackUrl) {
          try {
            // Handle both absolute and relative URLs
            const urlObj = new URL(callbackUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
            redirectUrl = urlObj.pathname + urlObj.search;
          } catch {
            // If URL parsing fails, use the callbackUrl as-is (for relative paths)
            redirectUrl = callbackUrl;
          }
        }
        
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="identifier"
        label="Email or Phone"
        value={formData.identifier}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, identifier: value }))
        }
        placeholder="you@example.com or +911234567890"
        required
      />

      <FormInput
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, password: value }))
        }
        placeholder="••••••••"
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        required
      />

      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20"
        />
        <label htmlFor="remember" className="text-xs text-white/70">
          Remember me
        </label>
      </div>

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-white/50 hover:text-white/80 underline transition-colors">
          Forgot password?
        </Link>
      </div>

      <SubmitButton isSubmitting={isSubmitting} text="Sign In" />

      {error && <AlertMessage type="error" message={error} />}

      <div className="relative flex items-center gap-3 mt-2">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: searchParams.get("callbackUrl") || "/profile" })}
        className="flex items-center justify-center gap-3 w-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
