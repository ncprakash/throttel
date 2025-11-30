"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";

type Subject =
  | "Order help"
  | "Product question"
  | "Returns & Refund"
  | "Warranty"
  | "Technical issue"
  | "Other";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [subject, setSubject] = useState<Subject>("Order help");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const maxFileSize = 5 * 1024 * 1024; // 5MB

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email address.";
    if (!message.trim()) e.message = "Please describe your issue.";
    if (file && file.size > maxFileSize)
      e.file = "Attachment too large. Max 5MB.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("email", email.trim());
      form.append("orderId", orderId.trim());
      form.append("subject", subject);
      form.append("message", message.trim());
      if (file) form.append("attachment", file);

      // Example POST to your backend. Create an API route at /api/support (example provided below).
      const res = await fetch("/api/support", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Server error");
      }

      setSuccess(
        "Thanks! Your message was sent. We'll get back within 24 hours."
      );
      // reset lightweight fields
      setName("");
      setEmail("");
      setOrderId("");
      setSubject("Order help");
      setMessage("");
      setFile(null);
      setErrors({});
    } catch (err: any) {
      console.error(err);
      setServerError(err?.message || "Something went wrong. Try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-16">
        <section className="text-center space-y-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Contact Support
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-sm">
            Fill the form below and our support team will respond within 24
            hours. For urgent issues include your Order ID and as much detail as
            you can.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="glass-panel bg-white/5 border border-white/8 rounded-2xl p-6"
        >
          {success ? (
            <div className="mb-4 rounded-md bg-green-800/30 border border-green-700 p-3 text-sm text-green-200">
              {success}
            </div>
          ) : null}

          {serverError ? (
            <div className="mb-4 rounded-md bg-red-900/25 border border-red-700 p-3 text-sm text-red-200">
              {serverError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col text-sm">
              <span className="text-white/70 mb-2">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`px-3 py-2 rounded-md bg-transparent border ${
                  errors.name ? "border-red-600" : "border-white/10"
                } text-white placeholder:text-white/40 focus:outline-none`}
                placeholder="Your full name"
              />
              {errors.name && (
                <span className="text-red-400 text-xs mt-1">{errors.name}</span>
              )}
            </label>

            <label className="flex flex-col text-sm">
              <span className="text-white/70 mb-2">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`px-3 py-2 rounded-md bg-transparent border ${
                  errors.email ? "border-red-600" : "border-white/10"
                } text-white placeholder:text-white/40 focus:outline-none`}
                placeholder="you@domain.com"
                type="email"
              />
              {errors.email && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.email}
                </span>
              )}
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col text-sm">
              <span className="text-white/70 mb-2">Order ID (optional)</span>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/40 focus:outline-none"
                placeholder="e.g. #THR-123456"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="text-white/70 mb-2">Subject</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/40 focus:outline-none"
              >
                <option>Order help</option>
                <option>Product question</option>
                <option>Returns & Refund</option>
                <option>Warranty</option>
                <option>Technical issue</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col text-sm mt-4">
            <span className="text-white/70 mb-2">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className={`px-3 py-2 rounded-md bg-transparent border ${
                errors.message ? "border-red-600" : "border-white/10"
              } text-white placeholder:text-white/40 focus:outline-none resize-vertical`}
              placeholder="Describe the issue, steps to reproduce, or anything helpful..."
            />
            {errors.message && (
              <span className="text-red-400 text-xs mt-1">
                {errors.message}
              </span>
            )}
          </label>

          <div className="mt-4">
            <label className="flex items-center gap-4">
              <input
                type="file"
                onChange={(ev) => {
                  const f = ev.target.files?.[0] ?? null;
                  setFile(f);
                }}
                className="text-sm file:bg-white/6 file:border file:border-white/10 file:px-3 file:py-2 file:rounded-md file:text-sm"
                accept=".png,.jpg,.jpeg,.pdf,.zip"
              />
              <div className="text-white/50 text-xs">
                Optional: attach screenshots or logs (max 5MB)
                {file ? <span className="block mt-1">{file.name}</span> : null}
                {errors.file ? (
                  <div className="text-red-400 text-xs mt-1">{errors.file}</div>
                ) : null}
              </div>
            </label>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg border ${
                submitting
                  ? "bg-white/10 border-white/20"
                  : "bg-white/10 hover:bg-white/20 border-white/20"
              }`}
            >
              {submitting ? (
                <svg
                  className="animate-spin h-4 w-4 text-white/60"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              <span className="text-sm">
                {submitting ? "Sending..." : "Send Message"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setOrderId("");
                setSubject("Order help");
                setMessage("");
                setFile(null);
                setErrors({});
                setServerError(null);
                setSuccess(null);
              }}
              className="text-sm text-white/60 hover:text-white underline"
            >
              Reset
            </button>
          </div>
        </form>

        <section className="mt-10 text-center text-sm text-white/60">
          <p>
            Prefer email? Send a message to{" "}
            <a href="mailto:Tforgedcustoms@gmail.com" className="underline">
              support@tfcustoms.in
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
