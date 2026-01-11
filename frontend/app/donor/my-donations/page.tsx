"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { DonationCard } from "@/components/donation-card"
import { EmptyState } from "@/components/empty-state"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockDonations, mockCurrentUser, type Status } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

type FilterTab = "all" | Status

export default function MyDonationsPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")

  // Filter donations for current user (mock)
  const userDonations = mockDonations

  const filteredDonations =
    activeFilter === "all" ? userDonations : userDonations.filter((d) => d.status === activeFilter)

  const counts = {
    all: userDonations.length,
    active: userDonations.filter((d) => d.status === "active").length,
    completed: userDonations.filter((d) => d.status === "completed").length,
    pending: userDonations.filter((d) => d.status === "pending").length,
    declined: userDonations.filter((d) => d.status === "declined").length,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader pageTitle="My Donations" points={mockCurrentUser.points} userRole="donor" />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterTab)} className="mb-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#2d6a4f] data-[state=active]:text-white">
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-[#2d6a4f] data-[state=active]:text-white">
                Active ({counts.active})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-[#2d6a4f] data-[state=active]:text-white"
              >
                Completed ({counts.completed})
              </TabsTrigger>
              <TabsTrigger value="declined" className="data-[state=active]:bg-[#2d6a4f] data-[state=active]:text-white">
                Declined ({counts.declined})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Donations List */}
          {filteredDonations.length > 0 ? (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <DonationCard key={donation.id} donation={donation} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📭"
              title="No donations found"
              description={
                activeFilter === "all"
                  ? "You haven't made any donations yet. Start donating to see your history here!"
                  : `No ${activeFilter} donations to show.`
              }
              actionLabel={activeFilter === "all" ? "Create Your First Donation" : undefined}
              onAction={activeFilter === "all" ? () => router.push("/donor/donate") : undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}
