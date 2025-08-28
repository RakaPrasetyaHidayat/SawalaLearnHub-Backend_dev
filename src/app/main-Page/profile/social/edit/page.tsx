import { EditSocialAccountPage } from "@/components/pages/social-account/edit-social-account/edit-social-account";
import { SocialAccountProvider } from "@/components/pages/social-account/context/social-account-context";

export default function EditSocialAccount() {
  return (
    <SocialAccountProvider>
      <EditSocialAccountPage />
    </SocialAccountProvider>
  );
}
