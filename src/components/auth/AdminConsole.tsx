// components/auth/AdminConsole.tsx
"use client";

import { FormEvent, useState,  } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FormInput from "./FormInpute"
import SubmitButton from "./SubmitButton"
import AlertMessage from  "./AlertMessage"

export default function AdminConsole() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "admin@throtter.io",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/admin",
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        setIsAuthenticated(true);
        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Admin authentication failed"
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
        id="admin-email"
        label="Admin Email"
        type="email"
        value={formData.email}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, email: value }))
        }
        required
      />

      <div className="space-y-2">
        <FormInput
          id="admin-password"
          label="Admin Password"
          type="password"
          value={formData.password}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, password: value }))
          }
          required
        />
        <p className="text-xs text-white/40">
          Default: <span className="text-white/70">ThrottleAdmin!23</span>
        </p>
      </div>

      <SubmitButton isSubmitting={isSubmitting} text="Enter Admin Console" />

      {error && <AlertMessage type="error" message={error} />}
    </form>
  );
}
