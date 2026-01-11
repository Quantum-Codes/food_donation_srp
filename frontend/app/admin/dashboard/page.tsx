import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import { mockPlatformStats, mockActivityLog } from "@/lib/mock-data"
import { Activity, TrendingUp, Users, Building2 } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#1b4332]">Admin Dashboard</h1>
        <Button variant="ghost" asChild>
          <Link href="/">Logout</Link>
        </Button>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Platform Statistics Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1b4332] mb-1">Platform Overview</h2>
            <p className="text-[#4a4a4a]">Monitor platform activity and manage operations</p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatsCard title="Total Donations" value={mockPlatformStats.totalDonations} color="primary" />
            <StatsCard title="Active Donations" value={mockPlatformStats.activeDonations} color="warning" />
            <StatsCard title="Completed Donations" value={mockPlatformStats.completedDonations} color="success" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[#4a4a4a]">Total Donors</p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{mockPlatformStats.totalDonors}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[#4a4a4a]">Total NGOs</p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{mockPlatformStats.totalNGOs}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-[#4a4a4a]">Total Staff</p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{mockPlatformStats.totalStaff}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-[#4a4a4a]">Points Awarded</p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{mockPlatformStats.pointsAwarded}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[#2d6a4f]" />
              <h3 className="text-lg font-semibold text-[#1b4332]">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {mockActivityLog.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-[#52b788] mt-2" />
                  <div className="flex-1">
                    <p className="text-[#1a1a1a]">{activity.action}</p>
                    <p className="text-sm text-[#4a4a4a]">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
