"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, ChevronRight, Clock, Filter, Play, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getUnsplashImage } from "@/lib/utils"
import Image from "next/image"
import React from "react"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Add a cache-busting parameter to ensure we get fresh data
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/courses?_=${timestamp}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        
        const data = await response.json()
        
        // Transform the data to match the course structure and ensure consistent images
        const transformedCourses: Course[] = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level,
          duration: course.duration,
          lessons: course.lessons || 0,
          progress: course.progress || 0,
          // Ensure we have a consistent image - either from the course or generate one
          image: course.image || getUnsplashImage(`course ${course.title} ${course.category}`, 300, 200),
          status: course.status || "Not Started",
          category: course.category
        }))
        
        setCourses(transformedCourses)
        console.log('Loaded courses:', transformedCourses.length)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setError('Failed to load courses. Please try again later.')
        
        // Fallback to hardcoded courses if API fails
        setCourses([
          {
            id: "digital-literacy",
            title: "Digital Literacy Fundamentals",
            description: "Learn the basics of using computers, internet, and digital tools",
            level: "Beginner",
            duration: "10 hours",
            lessons: 12,
            progress: 75,
            image: getUnsplashImage("digital literacy computers", 300, 200),
            status: "In Progress",
            category: "Digital Skills",
          },
          {
            id: "data-entry",
            title: "Basic Data Entry Skills",
            description: "Master data entry techniques and tools for remote work",
            level: "Beginner",
            duration: "8 hours",
            lessons: 10,
            progress: 40,
            image: getUnsplashImage("data entry typing", 300, 200),
            status: "In Progress",
            category: "Office Skills",
          },
          {
            id: "communication",
            title: "Communication Skills",
            description: "Develop effective written and verbal communication skills",
            level: "Intermediate",
            duration: "6 hours",
            lessons: 8,
            progress: 0,
            image: getUnsplashImage("communication skills speaking", 300, 200),
            status: "Not Started",
            category: "Soft Skills",
          },
          {
            id: "customer-service",
            title: "Customer Service Essentials",
            description: "Learn how to provide excellent customer service remotely",
            level: "Intermediate",
            duration: "12 hours",
            lessons: 15,
            progress: 0,
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=200&fit=crop&crop=entropy",
            status: "Not Started",
            category: "Service Skills",
          },
          {
            id: "content-writing",
            title: "Content Writing Basics",
            description: "Learn to write engaging content for websites and social media",
            level: "Intermediate",
            duration: "15 hours",
            lessons: 18,
            progress: 0,
            image: getUnsplashImage("content writing creative", 300, 200),
            status: "Not Started",
            category: "Writing Skills",
          },
          {
            id: "excel-basics",
            title: "Microsoft Excel Fundamentals",
            description: "Master the basics of spreadsheets and data organization",
            level: "Beginner",
            duration: "8 hours",
            lessons: 10,
            progress: 100,
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop&crop=entropy",
            status: "Completed",
            category: "Office Skills",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
    
    // Set up a refresh interval to check for new courses (every 30 seconds)
    const refreshInterval = setInterval(fetchCourses, 30000)
    
    // Clean up the interval when component unmounts
    return () => clearInterval(refreshInterval)
  }, [])

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">
          Explore our courses designed to help you build skills for remote work opportunities
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="digital">Digital Skills</SelectItem>
              <SelectItem value="office">Office Skills</SelectItem>
              <SelectItem value="soft">Soft Skills</SelectItem>
              <SelectItem value="service">Service Skills</SelectItem>
              <SelectItem value="writing">Writing Skills</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-4"></div>
          <p>Loading courses...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Course Tabs */}
      {!isLoading && !error && (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses
                .filter((course) => course.status === "In Progress")
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses
                .filter((course) => course.status === "Completed")
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="not-started" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses
                .filter((course) => course.status === "Not Started")
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Recommended Courses */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            course={{
              id: "virtual-assistant",
              title: "Virtual Assistant Training",
              description: "Learn the skills needed to work as a virtual assistant for global clients",
              level: "Intermediate",
              duration: "14 hours",
              lessons: 16,
              progress: 0,
              image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=200&fit=crop&crop=entropy",
              status: "Not Started",
              category: "Service Skills",
            }}
          />
          <CourseCard
            course={{
              id: "social-media",
              title: "Social Media Management",
              description: "Learn to manage social media accounts for businesses",
              level: "Intermediate",
              duration: "10 hours",
              lessons: 12,
              progress: 0,
              image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop&crop=entropy",
              status: "Not Started",
              category: "Digital Skills",
            }}
          />
          <CourseCard
            course={{
              id: "english-business",
              title: "Business English",
              description: "Improve your English skills for professional communication",
              level: "Beginner",
              duration: "20 hours",
              lessons: 24,
              progress: 0,
              image: getUnsplashImage("business english", 300, 200),
              status: "Not Started",
              category: "Language Skills",
            }}
          />
        </div>
      </div>

      {/* Course Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="digital-skills">
            <AccordionTrigger>Digital Skills</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryCourseItem title="Computer Basics" lessons={8} level="Beginner" />
                <CategoryCourseItem title="Internet Navigation" lessons={6} level="Beginner" />
                <CategoryCourseItem title="Email Management" lessons={5} level="Beginner" />
                <CategoryCourseItem title="Digital Security" lessons={7} level="Intermediate" />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="office-skills">
            <AccordionTrigger>Office Skills</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryCourseItem title="Microsoft Word" lessons={10} level="Beginner" />
                <CategoryCourseItem title="Microsoft Excel" lessons={12} level="Beginner to Intermediate" />
                <CategoryCourseItem title="Microsoft PowerPoint" lessons={8} level="Beginner" />
                <CategoryCourseItem title="Google Workspace" lessons={9} level="Beginner" />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="soft-skills">
            <AccordionTrigger>Soft Skills</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryCourseItem title="Communication Skills" lessons={8} level="All Levels" />
                <CategoryCourseItem title="Time Management" lessons={6} level="All Levels" />
                <CategoryCourseItem title="Problem Solving" lessons={7} level="Intermediate" />
                <CategoryCourseItem title="Teamwork" lessons={5} level="All Levels" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: number;
  progress: number;
  image: string;
  status: string;
  category: string;
}

function CourseCard({ course }: { course: Course }) {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-vikasini-orange"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Ensure the image URL is valid for Next.js Image component
  const imageUrl = React.useMemo(() => {
    try {
      // For specific courses, use hardcoded fallbacks to ensure reliability
      const specialCourseImages: Record<string, string> = {
        "customer-service": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=200&fit=crop&crop=entropy",
        "excel-basics": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop&crop=entropy",
        "virtual-assistant": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=200&fit=crop&crop=entropy", 
        "social-media": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop&crop=entropy",
        "communication": "https://images.unsplash.com/photo-1573496546620-c44559c46908?w=300&h=200&fit=crop&crop=entropy",
        "data-entry": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=entropy",
        "content-writing": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=300&h=200&fit=crop&crop=entropy",
      };
      
      // If it's a special course with a hardcoded fallback, use that
      if (course.id && specialCourseImages[course.id]) {
        return specialCourseImages[course.id];
      }
      
      // Otherwise use the course image or generate one based on category
      return course.image || getUnsplashImage(course.category, 300, 200);
    } catch (error) {
      console.error("Error generating image URL:", error);
      // Fallback to a reliable image URL if there's an error
      return "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&h=200";
    }
  }, [course.image, course.category, course.id]);

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="w-full h-40 relative">
          <Image 
            src={imageUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="sm" className="gap-2" asChild>
            <Link href={`/dashboard/course/${course.id}`}>
              <Play className="h-4 w-4" />
              {course.status === "In Progress" ? "Continue" : "Start"}
            </Link>
          </Button>
        </div>
        <Badge className={`absolute top-2 right-2 ${getBadgeColor(course.status)}`}>{course.status}</Badge>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-bold mb-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant="outline">{course.category}</Badge>
        </div>
        {course.progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface CategoryCourseItemProps {
  title: string;
  lessons: number;
  level: string;
}

function CategoryCourseItem({ title, lessons, level }: CategoryCourseItemProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div>
        <h4 className="font-medium">{title}</h4>
        <div className="text-xs text-muted-foreground">
          {lessons} lessons • {level}
        </div>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link href="#">
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
