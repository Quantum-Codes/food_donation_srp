"use client"

import { useState } from "react"
import Image from "next/image"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLeaderboard, mockCurrentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

type TimePeriod = "week" | "month" | "all"

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<TimePeriod>("all")

  // Mock different data for different periods
  const leaderboardData = mockLeaderboard.map((entry, index) => ({
    ...entry,
    points:
      period === "week"
        ? Math.floor(entry.points / 4)
        : period === "month"
          ? Math.floor(entry.points / 2)
          : entry.points,
  }))

  const currentUserEntry = leaderboardData.find((e) => e.isCurrentUser)

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return null
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300"
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300"
      case 3:
        return "bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300"
      default:
        return "bg-white border-gray-100"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader pageTitle="Leaderboard" points={mockCurrentUser.points} userRole="donor" />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header with trophy */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1b4332]">Top Donors</h2>
            <p className="text-[#4a4a4a]">See how you rank against other donors</p>
          </div>

          {/* Time Period Tabs */}
          <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)} className="mb-6">
            <TabsList className="w-full bg-white border">
              <TabsTrigger
                value="week"
                className="flex-1 data-[state=active]:bg-[#2d6a4f] data-[state=active]:text-white"
              >
                This Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="flex-1 data-[state=active]:bg-[#2d6a4f] data-[state=active]:text-white"
              >
                This Month
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="flex-1 data-[state=active]:bg-[#2d6a4f] data-[state=active]:text-white"
              >
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboardData.map((entry) => {
              const medal = getMedalEmoji(entry.rank)
              const isCurrentUser = entry.isCurrentUser

              return (
                <Card
                  key={entry.rank}
                  className={cn(
                    "p-4 border-2 transition-all hover:shadow-md",
                    getRankStyle(entry.rank),
                    isCurrentUser && "ring-2 ring-[#2d6a4f]",
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 text-center">
                      {medal ? (
                        <span className="text-2xl">{medal}</span>
                      ) : (
                        <span className="text-xl font-bold text-[#4a4a4a]">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative w-12 h-12">
                      <Image
                        src={entry.avatar || "/placeholder.svg"}
                        alt={entry.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>

                    {/* Name & Stats */}
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-semibold truncate", isCurrentUser ? "text-[#2d6a4f]" : "text-[#1a1a1a]")}>
                        {entry.name}
                        {isCurrentUser && <span className="ml-2 text-sm font-normal">(You)</span>}
                      </p>
                      <p className="text-sm text-[#4a4a4a]">{entry.donations} donations</p>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#2d6a4f]">{entry.points}</p>
                      <p className="text-xs text-[#4a4a4a]">points</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Current User Rank (if not in top 10) */}
          {currentUserEntry && currentUserEntry.rank > 10 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-[#4a4a4a] mb-3">Your Ranking</p>
              <Card className="p-4 border-2 border-[#2d6a4f] bg-green-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">
                    <span className="text-xl font-bold text-[#2d6a4f]">#{currentUserEntry.rank}</span>
                  </div>
                  <div className="relative w-12 h-12">
                    <Image
                      src={currentUserEntry.avatar || "/placeholder.svg"}
                      alt={currentUserEntry.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#2d6a4f]">{currentUserEntry.name}</p>
                    <p className="text-sm text-[#4a4a4a]">{currentUserEntry.donations} donations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#2d6a4f]">{currentUserEntry.points}</p>
                    <p className="text-xs text-[#4a4a4a]">points</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
