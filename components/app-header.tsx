"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AppHeaderProps {
  pageTitle: string
  points?: number
  showPoints?: boolean
  userRole?: "donor" | "staff" | "admin"
}

export function AppHeader({ pageTitle, points = 0, showPoints = true, userRole = "donor" }: AppHeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-[#1b4332]">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        {showPoints && userRole === "donor" && (
          <div className="flex items-center gap-2 bg-[#fff9e6] px-4 py-2 rounded-lg">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-[#f77f00]">{points} points</span>
          </div>
        )}
        <Button variant="ghost" asChild>
          <Link href="/">Logout</Link>
        </Button>
      </div>
    </header>
  )
}
