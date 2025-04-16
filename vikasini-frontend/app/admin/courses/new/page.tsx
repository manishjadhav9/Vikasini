"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function NewCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    level: "Beginner",
    duration: "",
    lessons: 0,
    category: "Digital Skills",
    image: "",
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle numeric changes
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = parseInt(value)
    if (!isNaN(numValue) || value === "") {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? "" : numValue
      }))
    }
  }

  // Generate ID from title
  const generateId = (title: string) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") // Replace multiple hyphens with a single one
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
  }

  // Update ID when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData(prev => ({
      ...prev,
      title: value,
      id: generateId(value)
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.title || !formData.description || !formData.duration || !formData.lessons) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      })
      return
    }

    // Ensure ID is generated if empty
    const courseData = {
      ...formData,
      id: formData.id || generateId(formData.title),
      progress: 0,
      status: "Not Started"
    };

    // Start submission
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      // Success
      toast({
        title: "Course Created Successfully",
        description: "The course has been added and will be visible to users immediately.",
      })
      
      // Redirect to courses list
      setTimeout(() => {
        router.push('/admin/courses')
      }, 1500)
    } catch (error) {
      console.error('Error creating course:', error)
      toast({
        title: "Error",
        description: "Failed to create the course. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/courses">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>Create a new course to be displayed to users.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Digital Literacy Fundamentals"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id">Course ID</Label>
              <Input
                id="id"
                name="id"
                placeholder="e.g. digital-literacy-fundamentals"
                value={formData.id}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                The ID will be used in the URL. Auto-generated from title but can be customized.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a detailed description of the course"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => handleSelectChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital Skills">Digital Skills</SelectItem>
                    <SelectItem value="Office Skills">Office Skills</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Service Skills">Service Skills</SelectItem>
                    <SelectItem value="Writing Skills">Writing Skills</SelectItem>
                    <SelectItem value="Language Skills">Language Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="e.g. 10 hours"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessons">Number of Lessons</Label>
                <Input
                  id="lessons"
                  name="lessons"
                  type="number"
                  placeholder="e.g. 12"
                  value={formData.lessons.toString()}
                  onChange={handleNumericChange}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Course Image URL</Label>
              <Input
                id="image"
                name="image"
                placeholder="Enter image URL or leave blank for auto-generated image"
                value={formData.image}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                If left blank, an image will be automatically generated based on the course category.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" type="button" onClick={() => router.push('/admin/courses')}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-vikasini-orange hover:bg-vikasini-orange/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Course
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 