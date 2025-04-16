"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Headphones } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"
import { useAuth } from "@/lib/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(userEmail, userPassword)
      // Redirect is handled by AuthContext
      // Adding a fallback redirection just in case
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(adminEmail, adminPassword)
      // Redirect is handled by AuthContext
      // Adding a fallback redirection just in case
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-vikasini-black text-white py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-vikasini-orange p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Vikasini</h1>
          </Link>

        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user">User Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">User Login</CardTitle>
                  <CardDescription>Enter your credentials to access your learning dashboard</CardDescription>
                </CardHeader>
                <form onSubmit={handleUserLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="user-password">Password</Label>
                        <Link href="#" className="text-sm text-vikasini-orange hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="user-password"
                        type="password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-vikasini-orange hover:bg-vikasini-orange/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-sm text-center text-gray-500">
                      Don&apos;t have an account?{" "}
                      <Link href="/register" className="text-vikasini-orange hover:underline">
                        Register
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Admin Login</CardTitle>
                  <CardDescription>Enter your admin credentials to access the control panel</CardDescription>
                </CardHeader>
                <form onSubmit={handleAdminLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@vikasini.org"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-password">Password</Label>
                        <Link href="#" className="text-sm text-vikasini-orange hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-vikasini-orange hover:bg-vikasini-orange/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-vikasini-black text-white py-4">
        <div className="container text-center text-sm">
          <p>© {new Date().getFullYear()} Vikasini. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
