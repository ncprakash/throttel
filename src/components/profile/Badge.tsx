"use client";
import React from "react";
import { cn } from "@/lib/utils";

export default function Badge({
  children,
  className = "",
  variant = "default",
  size = "sm",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center rounded-full font-medium backdrop-blur-md border transition-colors";

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const variants = {
    default: "bg-white/8 text-white/80 border-white/12",
    success: "bg-emerald-500/15 text-emerald-200 border-emerald-500/15",
    warning: "bg-yellow-500/15 text-yellow-200 border-yellow-500/15",
    danger: "bg-red-500/15 text-red-200 border-red-500/15",
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </span>
  );
}
