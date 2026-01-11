"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Building2 } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/ngos", label: "NGOs", icon: Building2 },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("w-64 bg-white border-r min-h-screen p-4", className)}>
      <Link href="/" className="flex items-center gap-2 mb-8 px-3">
        <span className="text-2xl">👤</span>
        <h2 className="font-bold text-[#2d6a4f]">Admin Portal</h2>
      </Link>

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
