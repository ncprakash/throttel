"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type UserType = {
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  name?: string | null;
};

export default function ProfileHeader({ onEdit }: { onEdit: () => void }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user) return;

    async function fetchUserData() {
      try {
        const userId = (session?.user as any)?.id;
        if (!userId) return;

        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data.user as UserType);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    }

    fetchUserData();
  }, [onEdit, session?.user]);
   
  if (status === "loading" || !user) return null;
  

  const isAdmin =
    (session?.user as any)?.role === "admin" ||
    (session?.user as any)?.roles?.includes?.("admin");

  return (
    <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent"></div>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            {/* USER INFO */}
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-tight truncate text-white">
                {`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
                  "MOCK NAME"}
              </h2>
              <p className="text-xs text-white/60 truncate mt-1">
                {user.email}
              </p>
              {user.phone && (
                <p className="text-xs text-white/60 mt-1">
                  Phone: {user.phone}
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 text-sm rounded-lg border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.3)] transition duration-300 hover:bg-emerald-500/20 hover:scale-105 hover:shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                  type="button"
                  aria-label="Go to admin panel"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.05)] transition duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-[0_0_16px_rgba(255,255,255,0.1)]"
                type="button"
                aria-label="Edit profile"
              >
                Edit
              </button>

              <button
                onClick={() => signOut({ callbackUrl: "/auth" })}
                className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-transparent text-white backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.05)] transition duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_16px_rgba(255,255,255,0.1)]"
                type="button"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
