"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileHeader({ onEdit }: { onEdit: () => void }) {
  const { data: session, status } = useSession();
  console.log(session);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading" || !session?.user) return null;

  const user = session.user;

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20">
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
      
      <div className="relative flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-tight truncate text-white">
                {user.name ?? "MOCK NAME"}
              </h2>
              <p className="text-xs text-white/60 truncate mt-1">{user.email}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 backdrop-blur-md bg-white/10 text-sm text-white hover:bg-white/20 transition-all duration-300 border border-white/20 rounded-lg shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Edit profile"
                type="button"
              >
                Edit
              </button>

              <button
                onClick={() => signOut()}
                className="px-4 py-2 backdrop-blur-md bg-transparent border border-white/20 text-sm text-white hover:bg-white/10 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Logout"
                type="button"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/50 backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full inline-block border border-white/10">
            Member since — demo
          </div>
        </div>
      </div>
    </div>
  );
}
