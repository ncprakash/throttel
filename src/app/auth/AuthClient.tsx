"use client";

import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

type TabType = "signin" | "signup";

export default function AuthClient() {
  const [activeTab, setActiveTab] = useState<TabType>("signin");

  return (
    <div className="w-full max-w-md transition-all duration-500">
      <div className="relative backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left edge accent */}
        <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        <div className="p-8">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-px h-6 bg-white/25" />
              <span className="text-[10px] tracking-[0.5em] text-white/35 uppercase">
                Throttle Forged Customs
              </span>
              <div className="w-px h-6 bg-white/25" />
            </div>
            <h1 className="text-5xl font-black tracking-[-0.04em] text-white leading-none">
              TFC
            </h1>
            <p className="text-xs text-white/35 mt-3 tracking-[0.2em] uppercase">
              Access your account
            </p>
          </div>

          {/* Tabs */}
          <div className="relative flex mb-8 p-1 bg-white/5 rounded-xl">
            <div
              className="absolute top-1 bottom-1 bg-white/10 rounded-lg transition-all duration-300 ease-out"
              style={{
                left: activeTab === "signin" ? "4px" : "calc(50% + 4px)",
                width: "calc(50% - 4px)",
              }}
            />
            {(["signin", "signup"] as TabType[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg z-10 ${
                  activeTab === tab
                    ? "text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {tab === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="transition-all duration-300">
            {activeTab === "signin" && <SignInForm />}
            {activeTab === "signup" && <SignUpForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
