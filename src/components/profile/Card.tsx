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
    <div className={`bg-white/4 p-4 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}
