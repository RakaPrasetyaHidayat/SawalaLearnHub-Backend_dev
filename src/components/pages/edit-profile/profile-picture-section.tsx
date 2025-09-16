"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { getCurrentUser } from "@/services/authService";
import { getAuthState } from "@/utils/auth";

export function ProfilePictureSection() {
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const backend = await getCurrentUser();
        let merged: any = backend || {};
        try {
          const local = (getAuthState()?.user as any) || null;
          if (local) merged = { ...(backend || {}), ...local };
        } catch {}
        setProfileImage(
          merged?.profile_image || merged?.profileImage || merged?.avatar || ""
        );
      } catch (e) {
        console.error("Failed to load profile image:", e);
      }
    };
    loadUser();
  }, []);

  const handleEditPicture = () => {
    // TODO: Implement upload/change avatar
    console.log("Edit profile picture clicked");
  };

  const src = profileImage || "/assets/images/profile-placeholder.jpg";

  return (
    <div className="relative">
      {/* Profile Picture */}
      <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-200">
        {/* Use next/image for optimization. If broken, user will still see gray bg */}
        <Image
          src={src}
          alt="Profile"
          className="w-full h-full object-cover"
          width={100}
          height={100}
          unoptimized={!!profileImage && !src.startsWith("/")}
        />
      </div>

      {/* Edit Picture Button */}
      <button
        onClick={handleEditPicture}
        className="absolute bottom-0 right-0 w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Pencil className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
