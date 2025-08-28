"use client"

interface ProfileMenuItemButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  showArrow?: boolean
}

export default function ProfileMenuItemButton({ icon, label, onClick, showArrow = false }: ProfileMenuItemButtonProps) {
  return (
    <button onClick={onClick} className="w-full text-left block group">
      <div className="flex items-center justify-between py-2 px-6 border mt-2 border-black-100 ml-2 mr-2 rounded-md bg-white transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="text-gray-600 group-hover:text-blue-500 transition-colors">
            {icon}
          </div>
          <span className="text-gray-800 font-medium group-hover:text-blue-500 transition-colors">{label}</span>
        </div>
        {showArrow && (
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        )}
      </div>
    </button>
  )
}
