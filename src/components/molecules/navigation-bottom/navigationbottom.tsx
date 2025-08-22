"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bell, Users2, User } from "lucide-react"
import React from "react"

type NavItem = {
    href: string
    label: string
    icon: (props: { active: boolean }) => React.ReactNode
}

const items: NavItem[] = [
    {
        href: "/pagess",
        label: "Home",
        icon: ({ active }) => <Home size={22} className={active ? "text-blue-500" : "text-black"} />,
    },
    {
        href: "/pagess/notifications",
        label: "Bell",
        icon: ({ active }) => <Bell size={22} className={active ? "text-blue-500" : "text-black"} />,
    },
    {
        href: "/pagess/members",
        label: "Member",
        icon: ({ active }) => <Users2 size={22} className={active ? "text-blue-500" : "text-black"} />,
    },
    {
        href: "/pagess/profile",
        label: "You",
        icon: ({ active }) => <User size={22} className={active ? "text-blue-500" : "text-black"} />,
    },
]

export default function NavigationBottom() {
    const pathname = usePathname()

    return (
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
            <ul className="flex items-center justify-around py-2">
                {items.map((item) => {
                    const active = pathname === item.href

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="flex flex-col items-center justify-center gap-1 px-3 py-1"
                                aria-current={active ? "page" : undefined}
                            >
                                {item.icon({ active })}
                                <span className={`text-xs ${active ? "text-blue-500" : "text-black"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}



