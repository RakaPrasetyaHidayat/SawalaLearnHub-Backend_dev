"use client";

import { useState } from "react";
import {
  ProfileHeader,
  ProfileMenuList,
  useProfileData,
} from "@/components/molecules/profile";
import { useRouter } from "next/navigation";

export default function ProfilePageClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { profileData, isLoading: profileLoading, error } = useProfileData();

  // Tentukan basePath dinamis: jika berada di /admin gunakan /admin/profile
  const isAdminPath =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");
  const basePath = isAdminPath ? "/admin/profile" : "/main-Page/profile";

  const handleEditProfile = () => {
    router.push(`${basePath}/edit-profile`);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {profileLoading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="mb-4">Failed to load profile: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!profileLoading && !error && (
        <>
          <ProfileHeader
            username={profileData.username}
            role={profileData.role}
            institution={profileData.institution}
            profileImage={profileData.profileImage}
            onEditProfile={handleEditProfile}
          />
          <ProfileMenuList onLogout={handleLogout} basePath={basePath} />
        </>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Logging out...</p>
          </div>
        </div>
      )}
    </div>
  );
}
