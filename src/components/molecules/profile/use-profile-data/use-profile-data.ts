import { useState, useEffect } from "react"

export interface ProfileData {
  id: string
  username: string
  role: string
  institution: string
  profileImage?: string
  email?: string
  phone?: string
  bio?: string
  joinDate?: string
}

// Data dummy yang mudah diganti dengan data dari database
const defaultProfileData: ProfileData = {
  id: "1",
  username: "Bimo",
  role: "Full Stack",
  institution: "SMKN 1 Sumedang",
  profileImage: "/assets/images/profile.png",
  email: "bimo@example.com",
  phone: "+62 812-3456-7890",
  bio: "Full Stack Developer yang passionate dengan teknologi modern",
  joinDate: "2024-01-15"
}

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: Ganti dengan implementasi fetch data dari database saat endpoint siap
  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Sementara gunakan data default agar tidak error JSON ketika API belum ada
      setProfileData(defaultProfileData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile data')
    } finally {
      setIsLoading(false)
    }
  }


  const updateProfileData = async (updates: Partial<ProfileData>) => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Implementasi update ke database
      // const response = await fetch(`/api/profile/${profileData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // })
      // const updatedData = await response.json()

      // Update local state
      setProfileData(prev => ({ ...prev, ...updates }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile data')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch profile data saat komponen mount
    fetchProfileData()
  }, [])

  return {
    profileData,
    isLoading,
    error,
    fetchProfileData,
    updateProfileData,
    setProfileData
  }
}

