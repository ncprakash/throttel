// components/Badge.tsx
"use client";

import React from "react";

type BadgeProps = {
  children?: React.ReactNode;
  className?: string;
  /**
   * Visual tone. We default to neutral monochrome visuals that obey your
   * globals.css variables. Use "success" for a more "positive" emphasis,
   * "muted" for subdued, or "neutral" (default).
   *
   * If you need real color accents (eg. green/red), pass custom className or
   * override CSS variables in a parent element.
   */
  tone?: "neutral" | "success" | "muted";
  /**
   * Optional aria label for extra clarity.
   */
  ariaLabel?: string;
};

export default function Badge({
  children,
  className = "",
  tone = "neutral",
  ariaLabel,
}: BadgeProps) {
  // Base styles (monochrome, variable-driven)
  // - border: var(--border)
  // - foreground: var(--foreground)
  // - muted text: var(--muted)
  // - background uses subtle overlay of foreground for contrast
  const toneStyles: Record<string, string> = {
    neutral:
      "bg-[color:var(--foreground)_/0.04] text-[var(--foreground)] border border-[var(--border)]",
    success:
      // still monochrome by default; if you want colored success, override with className
      "bg-[color:var(--foreground)_/0.06] text-[var(--foreground)] border border-[var(--border)]",
    muted: "bg-transparent text-[var(--muted)] border border-[var(--border)]/0",
  };

  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm select-none ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
