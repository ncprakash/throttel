// app/admin/users/page.tsx
"use client";

import UsersList from "@/components/admin/UsersList";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-white/60 mt-1">
            View and manage registered users.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <UsersList />
      </div>
    </div>
  );
}
