"use client";

import { Button } from "@/components/atoms/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/atoms/ui/avatar";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/authService";
import { getAuthState } from "@/utils/auth";
import { getDisplayDivision } from "@/services/division";

interface ProfileHeaderProps {
  onEditProfile?: () => void;
  username?: string;
  role?: string;
  institution?: string;
  profileImage?: string;
}

interface UserData {
  name: string;
  division: string;
  school_name: string;
  profile_image?: string;
}

export default function ProfileHeader({ onEditProfile }: ProfileHeaderProps) {
  const [userData, setUserData] = useState({
    username: "",
    division: "",
    school_name: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const backend = await getCurrentUser();

        // Merge backend with local overrides from auth state/localStorage
        let merged: any = backend || {};
        try {
          const local = (getAuthState()?.user as any) || null;
          if (local) {
            merged = { ...(backend || {}), ...local };
          }
        } catch {}

        setUserData({
          username:
            merged?.name ||
            merged?.username ||
            merged?.full_name ||
            (typeof merged?.email === "string"
              ? merged.email.split("@")[0]
              : "User") ||
            "User",
          division: getDisplayDivision(merged) || "",
          school_name:
            merged?.school_name || merged?.school || merged?.institution || "",
          profileImage:
            merged?.profile_image ||
            merged?.profileImage ||
            merged?.avatar ||
            "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-blue-500 text-white p-6 pb-8 rounded-b-[16px] relative z-20">
      <div className="flex items-start gap-4 mb-5">
        <Avatar className="w-20 mt-5 h-20 border-4 border-white/20 shadow-lg">
          <AvatarImage src={userData.profileImage} alt={userData.username} />
          <AvatarFallback className="bg-white/20 text-white text-2xl font-semibold">
            {(userData.username || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 pt-4">
          <h1 className="text-xl font-semibold text-white">
            {userData.username}
          </h1>
          <p className="text-white/90 mb-1 font-medium">{userData.division}</p>
          <p className="text-white/80 text-sm">{userData.school_name}</p>
        </div>
      </div>

      <div className="flex justify-left">
        <Button
          variant="outline"
          size="sm"
          onClick={onEditProfile}
          className="border-white/80 mb-2 bg-transparent text-white px-6 py-2 rounded-sm font-medium shadow-sm"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
