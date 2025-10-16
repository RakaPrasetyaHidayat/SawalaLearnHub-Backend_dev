import {
  FileText,
  ClipboardCheck,
  GraduationCap,
  Network,
  LogOut,
} from "lucide-react";
import ProfileMenuItemLink from "../profile-menu-item-link/profile-menu-item-link";
import ProfileMenuItemButton from "../profile-menu-item-button/profile-menu-item-button";
import LogoutConfirmationDialog from "../logout-confirmation-dialog/logout-confirmation-dialog";

interface ProfileMenuListProps {
  onLogout?: () => void;
  basePath?: string;
}

export default function ProfileMenuList({
  onLogout,
  basePath = "/main-Page/profile",
}: ProfileMenuListProps) {
  return (
    <div className="bg-white rounded-t-[32px] -mt-6 relative z-10 min-h-screen">
      <div className="pt-6">
        <ProfileMenuItemLink
          icon={<FileText className="w-6 h-6" />}
          label="My Post"
          href={`${basePath}/posts`}
        />
        <ProfileMenuItemLink
          icon={<ClipboardCheck className="w-6 h-6" />}
          label="Tasks"
          href={`${basePath}/tasks`}
        />
        {/* <ProfileMenuItemLink
          icon={<GraduationCap className="w-6 h-6" />}
          label="Education"
          href={`${basePath}/education`}
        /> */}
        {/* <ProfileMenuItemLink
          icon={<Network className="w-6 h-6" />}
          label="Social Account"
          href={`${basePath}/social`}
        /> */}
        <LogoutConfirmationDialog onConfirm={onLogout || (() => {})}>
          <ProfileMenuItemButton
            icon={<LogOut className="w-6 h-6" />}
            label="Logout"
            onClick={() => {}}
          />
        </LogoutConfirmationDialog>
      </div>
    </div>
  );
}
