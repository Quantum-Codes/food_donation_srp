import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <AdminSidebar className="hidden md:block" />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav role="admin" />
    </div>
  )
}
