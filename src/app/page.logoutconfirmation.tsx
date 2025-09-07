"use client"

import ProfileMenuList from '@/components/molecules/profile/profile-menu-list'

export default function LogoutConfirmationPreview() {
  const handleLogout = () => {
    console.log('User logged out')
    alert('Logged out successfully!')
    // In a real app, this would redirect to login or clear auth state
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
      {/* Mock profile header area */}
      <div className="pt-16 pb-8 px-6 text-center">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-2xl font-semibold">JD</span>
          </div>
        </div>
        <h1 className="text-white text-xl font-semibold mb-1">John Doe</h1>
        <p className="text-blue-100 text-sm">Frontend Developer</p>
      </div>

      {/* Profile Menu List with Logout Confirmation */}
      <ProfileMenuList onLogout={handleLogout} />
      
      {/* Instructions overlay */}
      <div className="fixed top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-blue-200 z-50">
        <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on menu items to navigate (links disabled in preview)</li>
          <li>• Click on "Logout" to see the confirmation dialog</li>
          <li>• The dialog shows "Are you sure you want to leave?" as requested</li>
          <li>• Choose "Yes" to confirm logout or "Cancel" to dismiss</li>
        </ul>
      </div>
    </div>
  )
}