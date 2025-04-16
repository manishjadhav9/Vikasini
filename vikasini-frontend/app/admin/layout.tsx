import type React from "react"
import { AdminSidebar } from "@/components/layout/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminSidebar>{children}</AdminSidebar>
    </ProtectedRoute>
  )
}
