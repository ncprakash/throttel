// components/auth/SignUpForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import AlertMessage from "./AlertMessage";

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/auth/sign-up", {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phoneNumber.trim(),
        password: formData.password,
      });

      const redirectUrl = `/verify?otpemail=${encodeURIComponent(formData.email)}`;
      if (response.data.ok) {
        router.push(redirectUrl);
      } else if (response.data.emailFailed) {
        // Account was created but OTP email failed — go to verify so user can resend
        setError("Account created! OTP email had a hiccup. Redirecting you to enter OTP — use 'Resend OTP' there.");
        setTimeout(() => router.push(redirectUrl), 3000);
      } else {
        setError(response.data.error || "Registration failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Registration failed"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, firstName: value }))
          }
          placeholder="John"
          required
        />
        <FormInput
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, lastName: value }))
          }
          placeholder="Doe"
          required
        />
      </div>

      <FormInput
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
        placeholder="you@example.com"
        required
      />

      <FormInput
        id="phoneNumber"
        label="Phone Number"
        type="tel"
        value={formData.phoneNumber}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, phoneNumber: value }))
        }
        placeholder="+1 (555) 000-0000"
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

      <SubmitButton isSubmitting={isSubmitting} text="Create Account" />

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
        Sign up with Google
      </button>
    </form>
  );
}
