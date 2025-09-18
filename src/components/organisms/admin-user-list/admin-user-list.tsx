"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserListItem, UserListItemProps, UserStatus } from "@/components/molecules/user-list-item/user-list-item";
import { Search } from "lucide-react";

// Mock data based on the image
const mockUsers: UserListItemProps[] = [
  {
    id: 1,
    name: "Bimo Fikry",
    role: "UI UX designer",
    status: "Approved" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Raka",
    role: "UI UX designer",
    status: "Pending" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Agnia Albaitsah",
    role: "UI UX designer",
    status: "Pending" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Aufa Adilah",
    role: "UI UX designer",
    status: "Pending" as UserStatus,
    avatarSrc: "https://i.pravatar.cc/150?img=4",
  },
];

export function AdminUserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return mockUsers;
    
    const query = searchQuery.toLowerCase();
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleUserClick = (user: UserListItemProps) => {
    // Navigate to user detail page
    router.push(`/admin/users/${user.id}`);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Users</h2>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* User List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-100">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserListItem
                key={user.id}
                {...user}
                onClick={() => handleUserClick(user)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No users found</p>
              {searchQuery && (
                <p className="text-xs mt-1">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}