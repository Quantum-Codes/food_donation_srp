"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Map, List } from "lucide-react"

const navItems = [
  { href: "/staff/dashboard", label: "Map View", icon: Map },
  { href: "/staff/donations", label: "List View", icon: List },
]

interface StaffSidebarProps {
  className?: string
  ngoName?: string
}

export function StaffSidebar({ className, ngoName = "Green Hands" }: StaffSidebarProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("w-64 bg-white border-r min-h-screen p-4", className)}>
      <Link href="/" className="flex items-center gap-2 mb-2 px-3">
        <span className="text-2xl">🚗</span>
        <h2 className="font-bold text-[#2d6a4f]">Staff Portal</h2>
      </Link>
      <p className="text-sm text-[#4a4a4a] px-3 mb-8">NGO: {ngoName}</p>

      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-green-50 text-[#2d6a4f] font-medium"
                    : "text-[#4a4a4a] hover:bg-green-50 hover:text-[#2d6a4f]",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
