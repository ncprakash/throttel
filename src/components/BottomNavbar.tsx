import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();

  const role = session?.user?.role;
  const profilePath = role === "admin" ? "/admin" : "/profile";

  // ...

  const navItems = [
    // ...home, shop, garage, about
    {
      id: "profile",
      path: profilePath,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
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

  const handleNavClick = (itemId: string, path: string) => {
    if (itemId === "profile") {
      // no session at all → go to auth
      if (!session?.user) {
        router.push("/auth");
        return;
      }
      // user exists → go to profile/admin based on role
      router.push(profilePath);
      return;
    }

    router.push(path);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-4 shadow-2xl shadow-black/50">
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const baseSizeClass = item.isCenter ? "w-14 h-14" : "w-12 h-12";
              const roundedAndLayout =
                "rounded-full flex items-center justify-center transition-all duration-500 relative group";

              if (item.id === "garage") {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.path)}
                    aria-label={item.label}
                    className={`${baseSizeClass} ${roundedAndLayout} bg-white text-black shadow-lg shadow-white/20`}
                  >
                    {item.icon}
                    {item.showBadge && cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg shadow-red-500/50 border-2 border-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.path)}
                  aria-label={item.label}
                  className={`
                    ${baseSizeClass} ${roundedAndLayout}
                    ${
                      isActive
                        ? "bg-white text-black scale-110"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  {item.icon}

                  {isActive && !item.isCenter && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  )}

                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap">
                    <span className="text-white text-xs font-light">
                      {item.label}
                    </span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl -z-10" />
        <div className="absolute top-full left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-xl -z-20" />
      </div>
    </div>
  );
}
