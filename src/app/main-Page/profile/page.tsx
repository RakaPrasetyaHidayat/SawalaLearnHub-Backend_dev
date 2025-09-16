"use client";

import { useState } from "react";
import { ProfileHeader, ProfileMenuList } from "@/components/molecules/profile";
import { useRouter } from "next/navigation";
import { logout as performLogout } from "@/utils/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEditProfile = () => {
    router.push("/main-Page/profile/edit-profile");
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Hapus token dan data user dari storage
      await Promise.resolve(performLogout());
      // Arahkan ke halaman login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header menampilkan data akun yang sedang login (otomatis fetch dari /api/auth/me) */}
      <ProfileHeader onEditProfile={handleEditProfile} />

      {/* Menu list */}
      <ProfileMenuList onLogout={handleLogout} />

      {/* Loading overlay saat logout */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Logging out...</p>
          </div>
        </div>
      )}
    </div>
  );
}
