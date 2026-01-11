import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { StatsCard } from "@/components/stats-card"
import { DonationCard } from "@/components/donation-card"
import { mockDonations, mockCurrentUser } from "@/lib/mock-data"
import { Plus } from "lucide-react"

export default function DonorDashboardPage() {
  const recentDonations = mockDonations.filter((d) => d.donorName === "John Doe").slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader pageTitle="Dashboard" points={mockCurrentUser.points} userRole="donor" />

      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1b4332] mb-2">Welcome back, {mockCurrentUser.name}!</h2>
            <p className="text-[#4a4a4a]">Thank you for helping reduce food waste in our community.</p>
          </div>

          {/* Quick Action */}
          <Card className="mb-8 p-6 bg-gradient-to-r from-[#2d6a4f] to-[#52b788] text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">Have food to donate?</h3>
                <p className="text-white/80">Create a new donation and help feed someone in need today.</p>
              </div>
              <Button asChild className="bg-white text-[#2d6a4f] hover:bg-gray-100 font-semibold">
                <Link href="/donor/donate">
                  <Plus className="w-5 h-5 mr-2" />
                  New Donation
                </Link>
              </Button>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard title="Total Donations" value={mockCurrentUser.totalDonations} color="primary" />
            <StatsCard title="Active Requests" value={mockCurrentUser.activeDonations} color="warning" />
            <StatsCard title="Total Points" value={mockCurrentUser.points} icon="⭐" color="info" />
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#1b4332]">Recent Activity</h3>
              <Link href="/donor/my-donations" className="text-[#2d6a4f] font-medium hover:underline">
                View all
              </Link>
            </div>

            {recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <DonationCard key={donation.id} donation={donation} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-[#4a4a4a] mb-4">No donations yet. Start donating to see your activity here!</p>
                <Button asChild className="bg-[#2d6a4f] hover:bg-[#1b4332]">
                  <Link href="/donor/donate">Create Your First Donation</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
