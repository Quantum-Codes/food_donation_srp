"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Plus, ClipboardList, Trophy, Map, List, Building2 } from "lucide-react"

type UserRole = "donor" | "staff" | "admin"

interface MobileNavProps {
  role: UserRole
}

const navConfigs = {
  donor: [
    { href: "/donor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/donor/donate", label: "Donate", icon: Plus },
    { href: "/donor/my-donations", label: "Donations", icon: ClipboardList },
    { href: "/donor/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  staff: [
    { href: "/staff/dashboard", label: "Map", icon: Map },
    { href: "/staff/donations", label: "List", icon: List },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/ngos", label: "NGOs", icon: Building2 },
  ],
}

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname()
  const navItems = navConfigs[role]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <ul className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
                  isActive ? "text-[#2d6a4f]" : "text-[#4a4a4a]",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
