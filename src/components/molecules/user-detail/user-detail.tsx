"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/atoms/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/cards/card";
import { ChevronLeft } from "lucide-react";

export interface UserDetailProps {
  id: string | number;
  name: string;
  email: string;
  division: string;
  angkatan: string;
  status: "Approved" | "Pending" | "Rejected" | "Active" | "Inactive";
  role: string;
  avatarSrc?: string;
  onBack?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
  onRoleChange?: (role: string) => void;
  onStatusChange?: (status: string) => void;
  isAdminView?: boolean;
}

export function UserDetail({
  name,
  email,
  division,
  angkatan,
  status,
  role,
  avatarSrc,
  onBack,
  onApprove,
  onReject,
  onDelete,
  onRoleChange,
  onStatusChange,
  isAdminView = false,
}: UserDetailProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">User Detail</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarSrc || "https://i.pravatar.cc/150?img=1"}
              alt={name}
            />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-medium">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-blue-600 block mb-1">
              Full Name
            </label>
            <p className="text-base text-gray-900 font-medium">{name}</p>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-blue-600 block mb-1">
              Email
            </label>
            <p className="text-base text-gray-700">{email}</p>
          </div>

          {/* Divisi */}
          <div>
            <label className="text-sm font-medium text-blue-600 block mb-1">
              Divisi
            </label>
            <p className="text-base text-gray-700">{division}</p>
          </div>

          {/* Angkatan */}
          <div>
            <label className="text-sm font-medium text-blue-600 block mb-1">
              Angkatan
            </label>
            <p className="text-base text-gray-700">{angkatan}</p>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-blue-600 block mb-1">
              Status
            </label>
            <Badge
              variant={
                status === "Approved" || status === "Active"
                  ? "default"
                  : "secondary"
              }
              className={`text-sm px-3 py-1 ${
                status === "Approved"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : status === "Active"
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  : status === "Pending"
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                  : status === "Rejected"
                  ? "bg-red-100 text-red-700 hover:bg-red-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status}
            </Badge>
          </div>

          {/* Assign Role */}
          <div>
            <label className="text-sm font-medium text-blue-600 block mb-2">
              Assign Role
            </label>
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="siswa">Siswa</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Change Status - Admin Only */}
          {isAdminView && onStatusChange && (
            <div>
              <label className="text-sm font-medium text-blue-600 block mb-2">
                Change Status
              </label>
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {isAdminView && (
            <div className="flex gap-3">
              <Button
                onClick={onApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              >
                Approve
              </Button>
              <Button
                onClick={onReject}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3"
              >
                Reject
              </Button>
            </div>
          )}
          <div className="flex gap-3">
            {isAdminView ? (
              <Button
                onClick={onDelete}
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3"
              >
                Delete User
              </Button>
            ) : (
              <>
                <Button
                  onClick={onApprove}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                >
                  Approve
                </Button>
                <Button
                  onClick={onReject}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
