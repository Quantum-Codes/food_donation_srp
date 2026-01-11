import type React from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { PriorityBadge } from "@/components/priority-badge"
import { StatusBadge } from "@/components/status-badge"
import { formatRelativeTime, type Donation } from "@/lib/mock-data"

interface DonationCardProps {
  donation: Donation
  showDonorName?: boolean
  actions?: React.ReactNode
}

export function DonationCard({ donation, showDonorName = false, actions }: DonationCardProps) {
  return (
    <Card className="flex gap-4 p-4 bg-white border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={donation.imageUrl || "/placeholder.svg"}
          alt={`Donation at ${donation.address}`}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <div className="min-w-0">
            <p className="font-semibold text-[#1a1a1a] truncate">{donation.address}</p>
            <p className="text-sm text-[#4a4a4a]">{donation.volume} servings</p>
            {showDonorName && <p className="text-sm text-[#4a4a4a]">Donor: {donation.donorName}</p>}
          </div>
          <PriorityBadge priority={donation.priority} />
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <StatusBadge status={donation.status} />
          {donation.points > 0 && <span className="text-sm text-[#2d6a4f] font-semibold">+{donation.points} pts</span>}
        </div>
        <p className="text-xs text-[#4a4a4a] mt-1">{formatRelativeTime(donation.createdAt)}</p>
        {actions && <div className="mt-3">{actions}</div>}
      </div>
    </Card>
  )
}
