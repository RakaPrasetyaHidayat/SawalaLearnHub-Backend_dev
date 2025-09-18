"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export type UserStatus = "Approved" | "Pending";

export interface UserListItemProps {
  id: string | number;
  name: string;
  role: string;
  status: UserStatus;
  avatarSrc?: string;
  onClick?: () => void;
}

export function UserListItem({
  name,
  role,
  status,
  avatarSrc,
  onClick,
}: UserListItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {role}
          </p>
          <Badge
            variant={status === "Approved" ? "default" : "secondary"}
            className={`mt-1 text-xs px-2 py-0.5 ${
              status === "Approved"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                : "bg-orange-100 text-orange-700 hover:bg-orange-100"
            }`}
          >
            {status}
          </Badge>
        </div>
      </div>
      
      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
    </div>
  );
}