"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PriorityBadge } from "@/components/priority-badge"
import { LeafletMap, type DonationWithCoords } from "@/components/leaflet-map"
import { mockDonations, mockStaffUser } from "@/lib/mock-data"
import { X, CheckCircle, List } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Filter only active donations for staff view and add coordinates
const activeDonations = mockDonations.filter((d) => d.status === "active" || d.status === "pending")

const donationLocations: DonationWithCoords[] = activeDonations.map((d, i) => ({
  ...d,
  lat: 13.6288 + (i * 0.008 - 0.02) + (Math.random() - 0.5) * 0.005,
  lng: 79.4192 + (i * 0.006 - 0.015) + (Math.random() - 0.5) * 0.005,
}))

export default function StaffDashboardPage() {
  const [selectedDonation, setSelectedDonation] = useState<DonationWithCoords | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [donations, setDonations] = useState(donationLocations)
  const [message, setMessage] = useState<{ type: "success" | "info"; text: string } | null>(null)

  const priorityCounts = {
    high: donations.filter((d) => d.priority === "high").length,
    medium: donations.filter((d) => d.priority === "medium").length,
    low: donations.filter((d) => d.priority === "low").length,
  }

  const handleComplete = () => {
    if (!selectedDonation) return

    setDonations((prev) => prev.filter((d) => d.id !== selectedDonation.id))
    setShowConfirmDialog(false)
    setSelectedDonation(null)
    setMessage({ type: "success", text: "Donation marked as completed!" })
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast message */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg ${
            message.type === "success" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#1b4332]">Map View</h1>
          <p className="text-sm text-[#4a4a4a]">NGO: {mockStaffUser.ngoName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="border-[#2d6a4f] text-[#2d6a4f] bg-transparent">
            <Link href="/staff/donations">
              <List className="w-4 h-4 mr-2" />
              List View
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="h-full flex flex-col gap-4">
          {/* Stats Bar */}
          <div className="flex gap-4 flex-wrap">
            <Card className="px-4 py-3 flex items-center gap-2 bg-white">
              <span className="text-sm font-medium text-[#4a4a4a]">Active Donations:</span>
              <span className="font-bold text-[#2d6a4f]">{donations.length}</span>
            </Card>
            <Card className="px-4 py-3 flex items-center gap-3 bg-white">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">High ({priorityCounts.high})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Medium ({priorityCounts.medium})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Low ({priorityCounts.low})</span>
              </div>
            </Card>
          </div>

          <Card className="flex-1 min-h-[500px] relative overflow-hidden">
            <LeafletMap
              donations={donations}
              onMarkerClick={(donation) => setSelectedDonation(donation)}
              center={[13.6288, 79.4192]}
              zoom={14}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md z-[1000]">
              <p className="text-xs font-semibold text-[#1a1a1a] mb-2">Priority Legend</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs">Low Priority</span>
                </div>
              </div>
            </div>

            {/* Info text */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md z-[1000]">
              <p className="text-sm text-[#4a4a4a]">Click on a marker to view details</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Donation Detail Popup */}
      {selectedDonation && !showConfirmDialog && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm mx-4 p-0 overflow-hidden bg-white">
            <div className="relative">
              <Image
                src={selectedDonation.imageUrl || "/placeholder.svg?height=200&width=400&query=food donation"}
                alt="Food donation"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => setSelectedDonation(null)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{selectedDonation.address}</p>
                  <p className="text-sm text-[#4a4a4a]">{selectedDonation.volume} servings</p>
                </div>
                <PriorityBadge priority={selectedDonation.priority} />
              </div>
              <p className="text-sm text-[#4a4a4a] mb-2">Donor: {selectedDonation.donorName}</p>
              {selectedDonation.description && (
                <p className="text-sm text-[#4a4a4a] italic mb-4">{selectedDonation.description}</p>
              )}
              <Button
                onClick={() => setShowConfirmDialog(true)}
                className="w-full bg-[#52b788] hover:bg-[#40916c] text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this donation as completed? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleComplete} className="bg-[#52b788] hover:bg-[#40916c] text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
