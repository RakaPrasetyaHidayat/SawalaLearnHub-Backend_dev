"use client"

import { useState } from "react"
import { ProfileHeader, ProfileMenuList, useProfileData } from "@/components/molecules/profile"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { profileData, isLoading: profileLoading, error } = useProfileData()

  const handleEditProfile = () => {
    // TODO: Implementasi edit profile
    console.log("Edit profile clicked")
    // router.push("/profile/edit")
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      
      // TODO: Implementasi logout sesuai dengan sistem autentikasi yang digunakan
      // Contoh: await signOut() atau clear localStorage/sessionStorage
      
      // Redirect ke halaman login
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading state */}
      {profileLoading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      )}

      {/* Error state */}
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

      {/* Profile content */}
      {!profileLoading && !error && (
        <>
          {/* Header dengan foto profil dan info user */}
          <ProfileHeader
            username={profileData.username}
            role={profileData.role}
            institution={profileData.institution}
            profileImage={profileData.profileImage}
            onEditProfile={handleEditProfile}
          />
          
          {/* Menu list */}
          <ProfileMenuList onLogout={handleLogout} />
        </>
      )}
      
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
  )
}
