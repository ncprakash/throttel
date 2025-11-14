// components/BottomNav.tsx - CYLINDER GLASSMORPHIC NAV
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BottomNav() {
  const [activeNav, setActiveNav] = useState("home");
  const router = useRouter();

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "shop", label: "Shop", href: "/shop" },
    {
      id: "garage",
      label: "Garage",
      href: "/garage",
      isCenter: true,
    },
    { id: "guides", label: "Guides", href: "/guides" },
    { id: "profile", label: "Profile", href: "/profile" },
  ];

  function handleNavClick(item: any) {
    setActiveNav(item.id);
    router.push(item.href); // Navigate
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        <div
          className="
          bg-black/40 backdrop-blur-2xl 
          border border-white/10
          rounded-full
          px-6 py-4
          shadow-2xl shadow-black/50
        "
        >
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`
                  relative group
                  ${item.isCenter ? "w-14 h-14" : "w-12 h-12"}
                  rounded-full
                  flex items-center justify-center
                  transition-all duration-500
                  ${
                    activeNav === item.id
                      ? "bg-white text-black scale-110"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }
                  ${
                    item.isCenter
                      ? "bg-white text-black shadow-lg shadow-white/20"
                      : ""
                  }
                `}
              >
                {item.icon}

                {/* Active Indicator */}
                {activeNav === item.id && !item.isCenter && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Tooltip */}
                <div
                  className="
                    absolute -top-14 left-1/2 -translate-x-1/2
                    bg-black/90 backdrop-blur-xl
                    border border-white/10
                    rounded-xl
                    px-3 py-2
                    opacity-0 group-hover:opacity-100
                    pointer-events-none
                    transition-all duration-300
                    whitespace-nowrap
                  "
                >
                  <span className="text-white text-xs font-light">
                    {item.label}
                  </span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl -z-10"></div>

        {/* Bottom Reflection */}
        <div className="absolute top-full left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-xl -z-20"></div>
      </div>
    </div>
  );
}
