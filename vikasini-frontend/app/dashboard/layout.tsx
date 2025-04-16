import type React from "react"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <DashboardSidebar>{children}</DashboardSidebar>
    </ProtectedRoute>
  )
}
