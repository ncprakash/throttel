"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileHeader({ onEdit }: { onEdit: () => void }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading" || !session?.user) return null;

  const user = session.user;

  return (
    <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
      {/* Soft radial glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent"></div>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            {/* USER INFO */}
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-tight truncate text-white">
                {user.name ?? "MOCK NAME"}
              </h2>
              <p className="text-xs text-white/60 truncate mt-1">
                {user.email}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={onEdit}
                className="
                  px-4 py-2 text-sm rounded-lg border border-white/20 
                  bg-white/10 text-white backdrop-blur-md
                  shadow-[0_0_10px_rgba(255,255,255,0.05)]
                  transition duration-300 
                  hover:bg-white/20 hover:scale-105 hover:shadow-[0_0_16px_rgba(255,255,255,0.1)]
                "
                type="button"
                aria-label="Edit profile"
              >
                Edit
              </button>

              <button
                onClick={() => signOut()}
                className="
                  px-4 py-2 text-sm rounded-lg border border-white/20 
                  bg-transparent text-white backdrop-blur-md
                  shadow-[0_0_10px_rgba(255,255,255,0.05)]
                  transition duration-300 
                  hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_16px_rgba(255,255,255,0.1)]
                "
                type="button"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>

          {/* MEMBER TAG */}
          <div
            className="
              mt-3 inline-block text-xs text-white/60 
              px-3 py-1.5 rounded-full border border-white/10 
              bg-white/5 backdrop-blur-sm
            "
          >
            Member since — demo
          </div>
        </div>
      </div>
    </div>
  );
}
