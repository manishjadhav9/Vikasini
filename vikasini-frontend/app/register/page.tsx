"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"

const AREAS_OF_INTEREST = [
  { id: "digital_literacy", label: "Digital Literacy" },
  { id: "data_entry", label: "Data Entry" },
  { id: "communication", label: "Communication Skills" },
  { id: "customer_service", label: "Customer Service" },
  { id: "content_writing", label: "Content Writing" },
  { id: "basic_programming", label: "Basic Programming" },
  { id: "office_tools", label: "Office Tools" },
  { id: "social_media", label: "Social Media Management" },
]

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: [] as string[]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
      return { ...prev, interests }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (formData.interests.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one area of interest",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        interests: formData.interests,
        role: 'user' // Set default role
      })
      
      toast({
        title: "Success",
        description: "Your account has been created successfully! Redirecting to dashboard...",
      })
      
      // Registration should already handle redirection via AuthContext
      // Adding a fallback redirection just in case
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: typeof error === 'string' ? error : "Failed to create account. Please try again.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join Vikasini to start your learning journey</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Areas of Interest (Select at least one)</Label>
              <div className="grid grid-cols-2 gap-4">
                {AREAS_OF_INTEREST.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest.id}
                      checked={formData.interests.includes(interest.id)}
                      onCheckedChange={() => handleInterestToggle(interest.id)}
                    />
                    <label
                      htmlFor={interest.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {interest.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-vikasini-orange hover:bg-vikasini-orange/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-vikasini-orange hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 