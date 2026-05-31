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

  const maxFileSize = 5 * 1024 * 1024;

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

  const inputClass = (field?: string) =>
    `w-full px-4 py-3 bg-white/[0.03] border ${
      field && errors[field] ? "border-red-500/50" : "border-white/8"
    } rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors`;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Page header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-4">
            We&apos;re here for you
          </p>
          <h1 className="text-6xl sm:text-8xl font-black tracking-[-0.04em] leading-none uppercase">
            Support
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Left: contact info */}
          <aside className="lg:col-span-2 space-y-10">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6">
                Response time
              </p>
              <p className="text-3xl font-black tracking-tight">
                Within
                <br />
                <span className="text-white/40">24 hours</span>
              </p>
            </div>

            <div className="h-px bg-white/5" />

            <div>
              <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6">
                Contact channels
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:Tforgedcustoms@gmail.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <svg
                      className="w-4 h-4 text-white/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Email</p>
                    <p className="text-sm text-white group-hover:text-white/80 transition-colors">
                      support@tfcustoms.in
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/throttleforgedcustoms"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <svg
                      className="w-4 h-4 text-white/60"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Instagram</p>
                    <p className="text-sm text-white group-hover:text-white/80 transition-colors">
                      @throttleforgedcustoms
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            <div>
              <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-4">
                Common topics
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Order status",
                  "Returns",
                  "Fitment",
                  "Warranty",
                  "Installation",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-300">
                  {success}
                </div>
              )}
              {serverError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass("name")}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className={inputClass("email")}
                    placeholder="you@domain.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
                    Order ID (optional)
                  </label>
                  <input
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. #THR-123456"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className={inputClass() + " cursor-pointer"}
                  >
                    <option className="bg-black">Order help</option>
                    <option className="bg-black">Product question</option>
                    <option className="bg-black">Returns & Refund</option>
                    <option className="bg-black">Warranty</option>
                    <option className="bg-black">Technical issue</option>
                    <option className="bg-black">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className={inputClass("message") + " resize-vertical"}
                  placeholder="Describe the issue, steps to reproduce, or anything helpful..."
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
                  Attachment (optional)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={(ev) => {
                      const f = ev.target.files?.[0] ?? null;
                      setFile(f);
                    }}
                    className="text-sm text-white/60 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-white/60 file:text-xs file:cursor-pointer hover:file:bg-white/10 file:transition-colors"
                    accept=".png,.jpg,.jpeg,.pdf,.zip"
                  />
                  <p className="text-xs text-white/30">Max 5MB</p>
                </div>
                {file && (
                  <p className="text-xs text-white/40 mt-1">{file.name}</p>
                )}
                {errors.file && (
                  <p className="text-red-400 text-xs mt-1">{errors.file}</p>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <svg
                      className="animate-spin h-4 w-4"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}
                  <span>{submitting ? "Sending..." : "Send Message"}</span>
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
                  className="text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
