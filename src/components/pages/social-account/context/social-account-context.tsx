"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SocialAccount {
  id: number;
  platform: string;
  username: string;
  icon: string;
  color: string;
  baseUrl: string;
}

interface SocialAccountContextType {
  accounts: SocialAccount[];
  updateAccounts: (newAccounts: SocialAccount[]) => void;
  updateUsername: (id: number, username: string) => void;
}

const defaultAccounts: SocialAccount[] = [
  {
    id: 1,
    platform: "GitHub",
    username: "bimo_fikry",
    icon: "/assets/icons/github.png",
    color: "bg-gray-800",
    baseUrl: "www.github.com/",
  },
  {
    id: 2,
    platform: "Instagram",
    username: "bimo_fikry",
    icon: "/assets/icons/instagram.png",
    color: "bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400",
    baseUrl: "www.instagram.com/",
  },
  {
    id: 3,
    platform: "LinkedIn",
    username: "bimo_fikry",
    icon: "/assets/icons/linkedin.png",
    color: "bg-blue-500",
    baseUrl: "www.linkedin.com/",
  },
];

const SocialAccountContext = createContext<SocialAccountContextType | undefined>(undefined);

export function SocialAccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<SocialAccount[]>(defaultAccounts);

  const updateAccounts = (newAccounts: SocialAccount[]) => {
    setAccounts(newAccounts);
  };

  const updateUsername = (id: number, username: string) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === id 
          ? { ...account, username }
          : account
      )
    );
  };

  return (
    <SocialAccountContext.Provider value={{ accounts, updateAccounts, updateUsername }}>
      {children}
    </SocialAccountContext.Provider>
  );
}

export function useSocialAccount() {
  const context = useContext(SocialAccountContext);
  if (context === undefined) {
    throw new Error("useSocialAccount must be used within a SocialAccountProvider");
  }
  return context;
}
