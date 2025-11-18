// components/GlobalBackground.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Behavior:
 * - On first client render shows "/frames/render1.png" (no flicker/hydration mismatch).
 * - On mount it chooses the random image for non-home routes (or keeps render1 for "/").
 * - Adds a small fade so change is smooth.
 */
export default function GlobalBackground() {
  const pathname = usePathname();
  const [bg, setBg] = useState("/frames/render1.png"); // deterministic initial

  useEffect(() => {
    // Keep render1 for home page
    if (pathname === "/") {
      setBg("/frames/render1.png");
      return;
    }

    // For all other pages choose a random frame 1..7 (can include render1)
    const idx = Math.floor(Math.random() * 7) + 1;
    setBg(`/frames/render${idx}.png`);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="
      fixed inset-0 -z-50
      bg-center bg-cover bg-no-repeat
      pointer-events-none 
      transition-opacity duration-700
    "
      style={{
        backgroundImage: `url('${bg}')`,
        opacity: 0.18,
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
      }}
    />
  );
}
