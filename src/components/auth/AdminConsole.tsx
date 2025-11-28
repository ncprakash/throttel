// components/auth/AdminConsole.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import FormInput from "./FormInpute";
import SubmitButton from "./SubmitButton";
import AlertMessage from "./AlertMessage";

export default function AdminConsole() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email.trim(),
      password: formData.password,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
    } else {
      // On success, you can check session and redirect
      router.push("/admin");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="admin-email"
        label="Admin Email"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
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
      </div>

      <SubmitButton isSubmitting={isSubmitting} text="Enter Admin Console" />

      {error && <AlertMessage type="error" message={error} />}
    </form>
  );
}
