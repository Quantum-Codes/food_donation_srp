"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DonationCard } from "@/components/donation-card"
import { EmptyState } from "@/components/empty-state"
import { mockDonations, mockStaffUser, type Donation, type Priority } from "@/lib/mock-data"
import { Map, CheckCircle, XCircle } from "lucide-react"

// Filter only active donations for staff view
const initialDonations = mockDonations.filter((d) => d.status === "active" || d.status === "pending")

type SortOption = "priority" | "time" | "volume"
type FilterOption = "all" | Priority

export default function StaffDonationsPage() {
  const [donations, setDonations] = useState(initialDonations)
  const [sortBy, setSortBy] = useState<SortOption>("priority")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "info"; text: string } | null>(null)

  // Sort donations
  const sortedDonations = [...donations].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      case "time":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "volume":
        return b.volume - a.volume
      default:
        return 0
    }
  })

  // Filter donations
  const filteredDonations =
    filterBy === "all" ? sortedDonations : sortedDonations.filter((d) => d.priority === filterBy)

  const handleComplete = () => {
    if (!selectedDonation) return

    setDonations((prev) => prev.filter((d) => d.id !== selectedDonation.id))
    setShowCompleteDialog(false)
    setMessage({ type: "success", text: `Donation completed! Donor awarded ${selectedDonation.points} points.` })
    setSelectedDonation(null)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDecline = () => {
    if (!selectedDonation) return

    setDonations((prev) => prev.filter((d) => d.id !== selectedDonation.id))
    setShowDeclineDialog(false)
    setMessage({ type: "info", text: "Donation declined. The donor has been notified." })
    setSelectedDonation(null)
    setDeclineReason("")
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
            message.type === "success" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#1b4332]">Active Pickups</h1>
          <p className="text-sm text-[#4a4a4a]">NGO: {mockStaffUser.ngoName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="border-[#2d6a4f] text-[#2d6a4f] bg-transparent">
            <Link href="/staff/dashboard">
              <Map className="w-4 h-4 mr-2" />
              Map View
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <Card className="p-4 mb-6 bg-white">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-sm text-[#4a4a4a] mb-1 block">Sort by</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="time">Most Recent</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm text-[#4a4a4a] mb-1 block">Filter by priority</Label>
                <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Donations List */}
          {filteredDonations.length > 0 ? (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  showDonorName
                  actions={
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedDonation(donation)
                          setShowCompleteDialog(true)
                        }}
                        className="flex-1 bg-[#52b788] hover:bg-[#40916c] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedDonation(donation)
                          setShowDeclineDialog(true)
                        }}
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🎉"
              title="All caught up!"
              description="There are no active pickups at the moment. Check back later for new donations."
            />
          )}
        </div>
      </div>

      {/* Complete Confirmation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Pickup Completion</DialogTitle>
            <DialogDescription>
              Confirm that you have successfully picked up this donation from {selectedDonation?.address}. The donor
              will receive {selectedDonation?.points} points.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete} className="bg-[#52b788] hover:bg-[#40916c] text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Donation Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Decline Donation</DialogTitle>
            <DialogDescription>Please provide a reason for declining this donation (optional).</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason (e.g., unable to reach location, food spoiled, etc.)"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowDeclineDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleDecline} className="bg-red-600 hover:bg-red-700 text-white">
              <XCircle className="w-4 h-4 mr-2" />
              Decline Donation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
