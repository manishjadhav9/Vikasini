"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Briefcase,
  Headphones,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Trophy,
  Users,
  VolumeIcon as VolumeUp,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/AuthContext"
import { getUnsplashImage } from "@/lib/utils"

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      href: "/dashboard/courses",
      icon: BookOpen,
    },
    {
      title: "Job Opportunities",
      href: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      title: "AI Mentor",
      href: "/dashboard/mentor",
      icon: Headphones,
    },
    {
      title: "Community",
      href: "/dashboard/community",
      icon: Users,
    },
    {
      title: "Achievements",
      href: "/dashboard/achievements",
      icon: Trophy,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2">
              <div className="bg-vikasini-orange p-1 rounded-full">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Vikasini</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full flex items-center justify-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage || getUnsplashImage("profile person user", 32, 32)} alt={user?.name || "User"} />
                      <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.name || "Priya Sharma"}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.xpPoints ? `XP: ${user.xpPoints}` : "XP: 1,250"}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <span className="w-full flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />
              <h2 className="text-lg font-medium">Dashboard</h2>
              <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <VolumeUp className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "Opportunities",
      href: "/admin/opportunities",
      icon: Briefcase,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Feedback",
      href: "/admin/feedback",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2">
              <div className="bg-vikasini-orange p-1 rounded-full">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Vikasini Admin</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full flex items-center justify-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUnsplashImage("admin professional", 32, 32)} alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">Admin User</span>
                      <span className="text-xs text-muted-foreground">Administrator</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/admin/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/admin/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/login" className="w-full">
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />
              <h2 className="text-lg font-medium">Admin Dashboard</h2>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
