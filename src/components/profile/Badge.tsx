"use client";
import React from "react";

export default function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
