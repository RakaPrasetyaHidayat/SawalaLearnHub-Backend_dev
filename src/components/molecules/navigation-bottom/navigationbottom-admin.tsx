"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users2, User, Users } from "lucide-react";
import React from "react";

type NavItem = {
  href: string;
  label: string;
  icon: (props: { active: boolean }) => React.ReactNode;
};

const items: NavItem[] = [
  {
    href: "/admin",
    label: "Home",
    icon: ({ active }) => (
      <Home
        className={`${
          active ? "text-blue-500" : "text-black"
        } w-5 h-5 max-[360px]:w-4 max-[360px]:h-4`}
      />
    ),
  },
  {
    href: "/admin/users",
    label: "User",
    icon: ({ active }) => (
      <Users
        className={`${
          active ? "text-blue-500" : "text-black"
        } w-5 h-5 max-[360px]:w-4 max-[360px]:h-4`}
      />
    ),
  },
  {
    href: "/admin/members",
    label: "Member",
    icon: ({ active }) => (
      <Users2
        className={`${
          active ? "text-blue-500" : "text-black"
        } w-5 h-5 max-[360px]:w-4 max-[360px]:h-4`}
      />
    ),
  },
  {
    href: "/admin/profile",
    label: "You",
    icon: ({ active }) => (
      <User
        className={`${
          active ? "text-blue-500" : "text-black"
        } w-5 h-5 max-[360px]:w-4 max-[360px]:h-4`}
      />
    ),
  },
];

export default function AdminNavigationBottom() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[10] w-[345px] max-[349px]:w-full m-auto bg-white/95 border-t border-gray-200 shadow-sm">
      <div className="mx-auto w-[350px] max-w-[350px] max-[349px]:w-full max-[349px]:px-2">
        <ul className="flex items-center justify-around py-2 max-[360px]:py-1">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-1"
                  aria-current={active ? "page" : undefined}
                >
                  {item.icon({ active })}
                  <span
                    className={`text-xs max-[360px]:text-[10px] ${
                      active ? "text-blue-500" : "text-black"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}