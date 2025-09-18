"use client";

import { useState } from "react";
import { UserListItem, UserStatus } from "@/components/molecules/user-list-item/user-list-item";
import { UserDetail } from "@/components/molecules/user-detail";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  division: string;
  angkatan: string;
  status: UserStatus;
  avatarSrc?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Bimo Fikry",
    email: "bimo@gmail.com",
    role: "UI UX designer",
    division: "UI/UX",
    angkatan: "2025",
    status: "Pending",
    avatarSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@gmail.com",
    role: "Frontend Developer",
    division: "Frontend",
    angkatan: "2024",
    status: "Approved",
    avatarSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Ahmad Rahman",
    email: "ahmad@gmail.com",
    role: "Backend Developer",
    division: "Backend",
    angkatan: "2025",
    status: "Pending",
    avatarSrc: "https://i.pravatar.cc/150?img=3"
  }
];

export function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const handleApprove = () => {
    if (selectedUser) {
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, status: "Approved" as UserStatus }
            : user
        )
      );
      setSelectedUser(prev => prev ? { ...prev, status: "Approved" } : null);
    }
  };

  const handleReject = () => {
    if (selectedUser) {
      // In a real app, you might want to remove the user or set a different status
      console.log("User rejected:", selectedUser.name);
      setSelectedUser(null);
    }
  };

  const handleRoleChange = (newRole: string) => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, role: newRole };
      setSelectedUser(updatedUser);
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, role: newRole }
            : user
        )
      );
    }
  };

  // Show user detail if a user is selected
  if (selectedUser) {
    return (
      <UserDetail
        id={selectedUser.id}
        name={selectedUser.name}
        email={selectedUser.email}
        division={selectedUser.division}
        angkatan={selectedUser.angkatan}
        status={selectedUser.status}
        role={selectedUser.role}
        avatarSrc={selectedUser.avatarSrc}
        onBack={handleBack}
        onApprove={handleApprove}
        onReject={handleReject}
        onRoleChange={handleRoleChange}
      />
    );
  }

  // Show user list
  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Click on any user to view details</p>
      </div>

      {/* User List */}
      <div className="divide-y divide-gray-100">
        {users.map((user) => (
          <UserListItem
            key={user.id}
            id={user.id}
            name={user.name}
            role={user.role}
            status={user.status}
            avatarSrc={user.avatarSrc}
            onClick={() => handleUserClick(user)}
          />
        ))}
      </div>
    </div>
  );
}