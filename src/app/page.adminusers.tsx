"use client";

import { AdminUserList } from "@/components/organisms/admin-user-list/admin-user-list";

export default function AdminUsersPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        <AdminUserList />
      </div>
    </div>
  );
}