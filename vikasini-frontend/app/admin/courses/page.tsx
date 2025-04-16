"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Course {
  _id: string
  id: string
  title: string
  description: string
  level: string
  duration: string
  lessons: number
  category: string
  status: string
  progress: number
  image?: string
}

export default function AdminCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses()
  }, [])

  // Filter courses when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = courses.filter(
        course =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery, courses])

  // Fetch courses from API
  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/courses')
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      const data = await response.json()
      setCourses(data)
      setFilteredCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle opening delete dialog
  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course)
    setDeleteDialogOpen(true)
  }

  // Handle course deletion
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/courses/${courseToDelete._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      // Remove course from state
      setCourses(courses.filter(course => course._id !== courseToDelete._id))
      toast({
        title: "Course Deleted",
        description: `"${courseToDelete.title}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error('Error deleting course:', error)
      toast({
        title: "Error",
        description: "Failed to delete the course. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage all courses available to users.</p>
        </div>
        <Button className="bg-vikasini-orange hover:bg-vikasini-orange/90" asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <CardTitle>Course List</CardTitle>
              <CardDescription>
                {courses.length} total courses
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-vikasini-orange" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>{course.lessons}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            course.status === "In Progress" ? "secondary" : 
                            course.status === "Completed" ? "secondary" : 
                            "secondary"
                          }
                          className={
                            course.status === "In Progress" ? "bg-vikasini-orange" : 
                            course.status === "Completed" ? "bg-green-500" : 
                            ""
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/courses/edit/${course._id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleDeleteClick(course)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No courses found</p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 