"use client";

import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

type TabType = "signin" | "signup";

export default function AuthClient() {
  const [activeTab, setActiveTab] = useState<TabType>("signin");

  return (
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
    </div>
  );
}
