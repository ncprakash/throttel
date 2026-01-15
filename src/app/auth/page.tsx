// app/auth/page.tsx
"use client";

import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import Footer from "@/components/Footer";

type TabType = "signin" | "signup";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("signin");

  return (
    <section className="min-h-screen w-full bg-transparent text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-16">
      
      {/* Auth Card */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-3xl transition-all duration-700">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              THROTTLE
            </h1>
            <p className="text-sm text-white/70">Access your account</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 sm:mb-8 border-b border-white/10">
            {(["signin", "signup"] as TabType[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                {tab === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Forms */}
          {activeTab === "signin" && <SignInForm />}
          {activeTab === "signup" && <SignUpForm />}
        </div>

        {/* Security Note */}
        <p className="mt-6 sm:mt-8 text-center text-xs uppercase tracking-[0.3em] text-white/30">
          Protected by industry-grade encryption
        </p>
      </div>

      {/* Footer */}
      <div className="mt-10 w-full">
        <Footer />
      </div>
    </section>
  );
}
