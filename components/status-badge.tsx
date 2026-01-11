import { cn } from "@/lib/utils"

type Status = "active" | "completed" | "pending" | "declined"

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    declined: "bg-red-100 text-red-700",
  }

  const labels = {
    active: "Active",
    completed: "Completed",
    pending: "Pending",
    declined: "Declined",
  }

  return (
    <span className={cn("px-3 py-1 rounded-full font-medium text-sm capitalize", styles[status], className)}>
      {labels[status]}
    </span>
  )
}
