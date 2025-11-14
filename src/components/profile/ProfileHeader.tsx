// components/ProfileHeader.tsx
"use client";
import React from "react";

type ProfileHeaderProps = {
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  onEdit: () => void;
};

export default function ProfileHeader({
  user = null,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 py-2">
      {/* LEFT — BIG NAME */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight truncate">
              {user?.first_name ?? ""} {user?.last_name ?? ""}
              MOCK NAME
            </h2>
            <p className="text-xs text-white/60 truncate">
              {user?.email ?? ""}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-white/10 text-sm hover:bg-white/15 transition border border-white/10"
              aria-label="Edit profile"
              type="button"
            >
              Edit
            </button>

            <button
              className="px-3 py-1 bg-transparent border border-white/20 text-sm hover:bg-white/5 transition"
              aria-label="Logout"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-1 text-xs text-white/60">Member since — demo</div>
      </div>
    </div>
  );
}
