"use client";

import { useParams, useRouter } from "next/navigation";
import { UserDetail } from "@/components/molecules/user-detail";
import { UserStatus } from "@/components/molecules/user-list-item/user-list-item";

// Mock data - in a real app, this would come from an API
const mockUsers = [
  {
    id: "1",
    name: "Bimo Fikry",
    email: "bimo@gmail.com",
    role: "UI UX designer",
    division: "UI/UX",
    angkatan: "2025",
    status: "Approved" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2", 
    name: "Raka",
    email: "raka@gmail.com",
    role: "UI UX designer", 
    division: "UI/UX",
    angkatan: "2025",
    status: "Pending" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Agnia Albaitsah",
    email: "agnia@gmail.com", 
    role: "UI UX designer",
    division: "UI/UX", 
    angkatan: "2024",
    status: "Pending" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    name: "Aufa Adilah", 
    email: "aufa@gmail.com",
    role: "UI UX designer",
    division: "UI/UX",
    angkatan: "2024", 
    status: "Pending" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=4"
  }
];

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Find the user by ID
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.push("/admin/users");
  };

  const handleApprove = () => {
    // In a real app, this would make an API call
    console.log("User approved:", user.name);
    // You could show a success message here
    alert(`${user.name} has been approved!`);
  };

  const handleReject = () => {
    // In a real app, this would make an API call
    console.log("User rejected:", user.name);
    // You could show a confirmation dialog here
    if (confirm(`Are you sure you want to reject ${user.name}?`)) {
      alert(`${user.name} has been rejected.`);
      router.push("/admin/users");
    }
  };

  const handleRoleChange = (newRole: string) => {
    // In a real app, this would make an API call
    console.log("Role changed for", user.name, "to", newRole);
    // You could show a success message here
  };

  return (
    <div className="w-full h-screen">
      <UserDetail
        id={user.id}
        name={user.name}
        email={user.email}
        division={user.division}
        angkatan={user.angkatan}
        status={user.status}
        role={user.role}
        avatarSrc={user.avatarSrc}
        onBack={handleBack}
        onApprove={handleApprove}
        onReject={handleReject}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}