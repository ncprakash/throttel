// components/auth/SignInForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FormInput from "./FormInpute"
import SubmitButton from "./SubmitButton";
import AlertMessage from "./AlertMessage";

export default function SignInForm() {
  const router = useRouter();
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
      const body = formData.identifier.includes("@")
        ? { email: formData.identifier.trim(), password: formData.password }
        : { phone: formData.identifier.trim(), password: formData.password };

      const response = await axios.post("/api/auth/sign-in", body, {
        withCredentials: true,
      });

      if (response.data.ok) {
        // Redirect to dashboard on success
        router.push("/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Sign-in failed"
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

      <SubmitButton isSubmitting={isSubmitting} text="Sign In" />

      {error && <AlertMessage type="error" message={error} />}
    </form>
  );
}
