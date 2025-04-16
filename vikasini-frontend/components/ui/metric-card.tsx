import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

interface MetricCardProps {
  title: string
  value: string
  change: string
  description: string
  icon: React.ReactNode
}

export function MetricCard({ title, value, change, description, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
} 