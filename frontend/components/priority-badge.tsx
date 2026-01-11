import { cn } from "@/lib/utils"

type Priority = "high" | "medium" | "low"

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const styles = {
    high: "bg-red-50 text-red-600 border-red-600",
    medium: "bg-orange-50 text-orange-600 border-orange-600",
    low: "bg-green-50 text-green-600 border-green-600",
  }

  const labels = {
    high: "HIGH PRIORITY",
    medium: "MEDIUM",
    low: "LOW",
  }

  const icons = {
    high: <span className="w-2 h-2 rounded-full bg-red-600" />,
    medium: <span className="w-2 h-2 rounded-full bg-orange-500" />,
    low: <span className="w-2 h-2 rounded-full bg-green-600" />,
  }

  return (
    <span
      className={cn(
        "border-2 px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center gap-2",
        styles[priority],
        className,
      )}
    >
      {icons[priority]}
      {labels[priority]}
    </span>
  )
}
