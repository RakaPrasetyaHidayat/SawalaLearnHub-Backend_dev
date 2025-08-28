"use client";

import { SocialAccountItem } from "./social-account-item/social-account-item";
import { useSocialAccount } from "./context/social-account-context";

export function SocialAccountList() {
  const { accounts } = useSocialAccount();

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <SocialAccountItem key={account.id} account={account} />
      ))}
    </div>
  );
}
