"use client";

import { UserDetail } from "@/components/molecules/user-detail";
import { useState } from "react";

export default function UserDetailPreview() {
  const [userRole, setUserRole] = useState("Member");
  
  const mockUser = {
    id: "1",
    name: "Bimo Fikry",
    email: "bimo@gmail.com",
    division: "UI/UX",
    angkatan: "2025",
    status: "Pending" as const,
    role: userRole,
    avatarSrc: "https://i.pravatar.cc/150?img=1"
  };

  const handleBack = () => {
    console.log("Back button clicked");
  };

  const handleApprove = () => {
    console.log("User approved");
  };

  const handleReject = () => {
    console.log("User rejected");
  };

  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
    console.log("Role changed to:", newRole);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserDetail
        {...mockUser}
        role={userRole}
        onBack={handleBack}
        onApprove={handleApprove}
        onReject={handleReject}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}