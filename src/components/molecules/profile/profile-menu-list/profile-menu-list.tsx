import { 
  FileText, 
  ClipboardCheck, 
  GraduationCap, 
  Network, 
  LogOut 
} from "lucide-react"
import ProfileMenuItemLink from "../profile-menu-item-link/profile-menu-item-link"
import ProfileMenuItemButton from "../profile-menu-item-button/profile-menu-item-button"

interface ProfileMenuListProps {
  onLogout?: () => void
}

export default function ProfileMenuList({ onLogout }: ProfileMenuListProps) {
  return (
    <div className="bg-white rounded-t-[32px] -mt-6 relative z-10 min-h-screen">
      <div className="pt-6">
        <ProfileMenuItemLink icon={<FileText className="w-6 h-6" />} label="My Post" href="/main-Page/profile/posts" />
        <ProfileMenuItemLink icon={<ClipboardCheck className="w-6 h-6" />} label="Tasks" href="/main-Page/profile/tasks" />
        <ProfileMenuItemLink icon={<GraduationCap className="w-6 h-6" />} label="Education" href="/main-Page/profile/education" />
        <ProfileMenuItemLink icon={<Network className="w-6 h-6" />} label="Social Account" href="/main-Page/profile/social" />
        <ProfileMenuItemButton icon={<LogOut className="w-6 h-6" />} label="Logout" onClick={onLogout || (()=>{})} />
      </div>
    </div>
  )
}
