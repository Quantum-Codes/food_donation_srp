import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon?: string
  color?: "primary" | "warning" | "info" | "success"
  className?: string
}

export function StatsCard({ title, value, icon, color = "primary", className }: StatsCardProps) {
  const colorClasses = {
    primary: "text-[#2d6a4f]",
    warning: "text-[#f77f00]",
    info: "text-[#1976d2]",
    success: "text-[#52b788]",
  }

  return (
    <Card className={cn("p-6 bg-white border border-gray-100", className)}>
      <h3 className="text-sm font-medium text-[#4a4a4a] mb-1">{title}</h3>
      <p className={cn("text-3xl font-bold", colorClasses[color])}>
        {value}
        {icon && <span className="ml-1">{icon}</span>}
      </p>
    </Card>
  )
}
