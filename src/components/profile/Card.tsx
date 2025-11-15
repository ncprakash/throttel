"use client";
import React from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-2xl 
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-[0_0_20px_rgba(255,255,255,0.05)]
        p-4
        transition
        hover:bg-white/10
        ${className}
      `}
    >
      {children}
    </div>
  );
}
