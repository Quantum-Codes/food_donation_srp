import type React from "react"
import { StaffSidebar } from "@/components/staff-sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <StaffSidebar className="hidden md:block" ngoName="Green Hands Foundation" />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav role="staff" />
    </div>
  )
}
