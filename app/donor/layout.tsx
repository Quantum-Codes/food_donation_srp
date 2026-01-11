import type React from "react"
import { DonorSidebar } from "@/components/donor-sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <DonorSidebar className="hidden md:block" />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav role="donor" />
    </div>
  )
}
