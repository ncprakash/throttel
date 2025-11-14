// components/auth/SignUpForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FormInput from "./FormInpute";
import SubmitButton from "./SubmitButton";
import AlertMessage from "./AlertMessage";
import { Alert, AlertTitle } from "../ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
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
      first_name: formData.firstName.trim(),      // ✅ Changed
      last_name: formData.lastName.trim(),        // ✅ Changed
      email: formData.email.trim(),
      phone: formData.phoneNumber.trim(),        
      password: formData.password,
    });
    if(response.data.ok==true){
        <Alert>
            <CheckCircle2Icon/>
            <AlertTitle>{response.data.message}</AlertTitle>
        </Alert>
    }

    if (response.data.ok) {
        const redirectUrl=`/verify?otpemail=${encodeURIComponent(formData.email)}`;
      router.push(redirectUrl);
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
    </form>
  );
}
