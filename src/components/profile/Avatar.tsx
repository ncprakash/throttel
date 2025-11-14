// components/Avatar.tsx
"use client";
import React from "react";

export default function Avatar({
  name,
  size = 96,
}: {
  name?: string;
  size?: number;
}) {
  const initial = name?.[0]?.toUpperCase() || "U";
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-2xl bg-white/6 flex items-center justify-center text-3xl font-extrabold"
    >
      {initial}
    </div>
  );
}
