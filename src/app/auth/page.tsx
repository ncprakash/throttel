// app/auth/page.tsx
"use client";

import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import AdminConsole from "@/components/auth/AdminConsole";

type TabType = "signin" | "signup" | "admin";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("signin");

  return (
    <section className="min-h-screen w-full bg-transparent text-white flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-3xl transition-all duration-1000 opacity-100 translate-y-0">
        <div className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              THROTTLE
            </h1>
            <p className="text-sm text-white/70">
              Access your account or manage the catalog
            </p>
          </div>

          <div className="flex gap-2 mb-8 border-b border-white/10">
            {(["signin", "signup", "admin"] as TabType[]).map((tab) => (
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
                {tab === "signin" && "Sign In"}
                {tab === "signup" && "Create Account"}
                {tab === "admin" && "Admin Console"}
              </button>
            ))}
          </div>

          {activeTab === "signin" && <SignInForm />}
          {activeTab === "signup" && <SignUpForm />}
          {activeTab === "admin" && <AdminConsole />}
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-[0.35em] text-white/30">
          Protected by industry-grade encryption
        </p>
      </div>
    </section>
  );
}
