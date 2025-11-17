// components/BottomNav.tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Function to update cart count from localStorage
    const updateCartCount = () => {
      try {
        const cartItems = localStorage.getItem("cartItems");
        if (cartItems) {
          const items = JSON.parse(cartItems);
          // Calculate total quantity of items
          const totalCount = Array.isArray(items)
            ? items.reduce((sum, item) => sum + (item.quantity || 1), 0)
            : 0;
          setCartCount(totalCount);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        setCartCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Listen for storage events (updates from other tabs)
    window.addEventListener("storage", updateCartCount);

    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const navItems = [
    {
      id: "home",
      path: "/",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: "Home",
    },
    {
      id: "shop",
      path: "/shop",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      label: "Shop",
    },
    {
      id: "garage",
      path: "/cart",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      label: "Garage",
      isCenter: true,
      showBadge: true,
    },
    {
      id: "about",
      path: "/about",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
      ),
      label: "About",
    },
    {
      id: "profile",
      path: "/profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Profile",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-4 shadow-2xl shadow-black/50">
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className={`
                    relative group
                    ${item.isCenter ? "w-14 h-14" : "w-12 h-12"}
                    rounded-full flex items-center justify-center
                    transition-all duration-500
                    ${
                      isActive
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

                  {/* Cart Badge */}
                  {item.showBadge && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg shadow-red-500/50 border-2 border-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}

                  {/* Active Indicator */}
                  {isActive && !item.isCenter && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  )}

                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap">
                    <span className="text-white text-xs font-light">
                      {item.label}
                    </span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45"></div>
                  </div>
                </button>
              );
            })}
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
