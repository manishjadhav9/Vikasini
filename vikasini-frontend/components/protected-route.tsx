'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // For testing purposes - don't enforce authentication
  // This allows us to see the dashboard even if not logged in
  useEffect(() => {
    // Comment out redirection for testing
    /*
    // If authentication check is complete and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }

    // If adminOnly route but user is not admin, redirect to dashboard
    if (!isLoading && isAuthenticated && adminOnly && user?.role !== 'admin') {
      router.push('/dashboard')
    }
    */
  }, [isLoading, isAuthenticated, user, adminOnly, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-t-vikasini-orange animate-spin"></div>
      </div>
    )
  }

  // For testing purposes - always show content, don't enforce authentication
  return <>{children}</>

  /* Original secure implementation
  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Show nothing if admin route but user is not admin (will redirect)
  if (adminOnly && user?.role !== 'admin') {
    return null
  }

  // Render children if authenticated and has appropriate role
  return <>{children}</>
  */
} 