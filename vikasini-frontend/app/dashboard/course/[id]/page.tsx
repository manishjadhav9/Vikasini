"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Headphones,
  MessageSquare,
  Play,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getUnsplashImage } from "@/lib/utils"
import Image from "next/image"

// Type definitions for the components
interface LessonItemProps {
  lesson: {
    id: number;
    title: string;
    duration: string;
    type: string;
    completed: boolean;
  };
  isActive: boolean;
  onClick: () => void;
}

interface DiscussionPostProps {
  user: string;
  avatar: string;
  time: string;
  content: string;
  replies: number;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeLesson, setActiveLesson] = useState(1)

  // Use React.use() to unwrap the params object
  const resolvedParams = React.use(params as any) as { id: string }
  const courseId = resolvedParams.id

  // Mock course data based on ID
  const course = {
    id: courseId,
    title:
      courseId === "digital-literacy"
        ? "Digital Literacy Fundamentals"
        : courseId === "data-entry"
          ? "Basic Data Entry Skills"
          : "Communication Skills",
    description:
      "Learn the essential skills needed to navigate the digital world confidently. This course covers computer basics, internet usage, email, and online safety.",
    level: "Beginner",
    duration: "10 hours",
    instructor: "Anjali Mehta",
    instructorRole: "Digital Skills Trainer",
    instructorAvatar: getUnsplashImage("indian woman professor teacher", 80, 80),
    progress: courseId === "digital-literacy" ? 75 : courseId === "data-entry" ? 40 : 0,
    image: getUnsplashImage("digital literacy computer", 800, 400),
    lessons: [
      {
        id: 1,
        title: "Introduction to Digital Literacy",
        duration: "15 min",
        type: "video",
        completed: true,
      },
      {
        id: 2,
        title: "Computer Basics",
        duration: "45 min",
        type: "video",
        completed: true,
      },
      {
        id: 3,
        title: "Internet Navigation",
        duration: "30 min",
        type: "video",
        completed: true,
      },
      {
        id: 4,
        title: "Email Fundamentals",
        duration: "40 min",
        type: "video",
        completed: courseId === "digital-literacy",
      },
      {
        id: 5,
        title: "Online Safety and Security",
        duration: "35 min",
        type: "video",
        completed: false,
      },
      {
        id: 6,
        title: "Module 1 Quiz",
        duration: "20 min",
        type: "quiz",
        completed: false,
      },
      {
        id: 7,
        title: "Social Media Basics",
        duration: "45 min",
        type: "video",
        completed: false,
      },
      {
        id: 8,
        title: "Digital Communication Tools",
        duration: "50 min",
        type: "video",
        completed: false,
      },
      {
        id: 9,
        title: "Practical Assignment",
        duration: "60 min",
        type: "assignment",
        completed: false,
      },
      {
        id: 10,
        title: "Final Assessment",
        duration: "45 min",
        type: "quiz",
        completed: false,
      },
    ],
    skills: ["Computer Basics", "Internet Navigation", "Email Management", "Online Safety", "Digital Communication"],
    requirements: [
      "No prior experience required",
      "Basic reading and writing skills",
      "Access to a computer or smartphone",
    ],
    materials: [
      {
        title: "Digital Literacy Handbook",
        type: "PDF",
        size: "2.4 MB",
      },
      {
        title: "Internet Safety Checklist",
        type: "PDF",
        size: "1.1 MB",
      },
      {
        title: "Practice Exercises",
        type: "PDF",
        size: "3.2 MB",
      },
    ],
  }

  // Calculate completed lessons
  const completedLessons = course.lessons.filter((lesson) => lesson.completed).length
  const totalLessons = course.lessons.length
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100)

  // Add useMemo to sanitize image URLs
  const courseImage = React.useMemo(() => {
    try {
      return course.image || getUnsplashImage(`${course.title} course`, 800, 400);
    } catch (error) {
      console.error("Error generating course image URL:", error);
      return "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400";
    }
  }, [course.image, course.title]);

  const lessonImage = React.useMemo(() => {
    try {
      const lessonTitle = course.lessons.find((l) => l.id === activeLesson)?.title || "lesson";
      return getUnsplashImage(`${lessonTitle} education tutorial`, 800, 400);
    } catch (error) {
      console.error("Error generating lesson image URL:", error);
      return "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&h=400";
    }
  }, [course.lessons, activeLesson]);

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/courses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            <Link href="/dashboard/courses" className="hover:underline">
              Courses
            </Link>
            <span className="mx-2">/</span>
            <span>{course.title}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{totalLessons} lessons</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={course.instructorAvatar || getUnsplashImage("teacher professor", 80, 80)} alt={course.instructor} />
                <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{course.instructor}</div>
                <div className="text-sm text-muted-foreground">{course.instructorRole}</div>
              </div>
            </div>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-md mb-4 relative">
                <div className="relative w-full h-full rounded-md overflow-hidden">
                  <Image
                    src={courseImage}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button className="bg-vikasini-orange hover:bg-vikasini-orange/90 rounded-full h-12 w-12 p-0">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Course Progress</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
                <div className="text-sm">
                  <span className="font-medium">{completedLessons}</span> of{" "}
                  <span className="font-medium">{totalLessons}</span> lessons completed
                </div>
                <Button className="w-full bg-vikasini-orange hover:bg-vikasini-orange/90">
                  {completedLessons > 0 ? "Continue Learning" : "Start Course"}
                </Button>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="icon">
                    <Headphones className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content */}
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Course Lessons</h2>
            <div className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} completed
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="module-1">
              <AccordionTrigger>Module 1: Getting Started</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {course.lessons.slice(0, 6).map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      isActive={activeLesson === lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="module-2">
              <AccordionTrigger>Module 2: Advanced Topics</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {course.lessons.slice(6).map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      isActive={activeLesson === lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.skills.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-vikasini-orange mt-0.5" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-vikasini-orange mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>Download these materials to support your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-vikasini-orange" />
                      <div>
                        <div className="font-medium">{material.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {material.type} • {material.size}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="discussion">
          <Card>
            <CardHeader>
              <CardTitle>Course Discussion</CardTitle>
              <CardDescription>Connect with other learners and ask questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DiscussionPost
                  user="Meera K."
                  avatar={getUnsplashImage("student woman", 40, 40)}
                  time="2 days ago"
                  content="I'm having trouble with the email section. Can someone explain how to set up email filters?"
                  replies={3}
                />
                <DiscussionPost
                  user="Lakshmi R."
                  avatar={getUnsplashImage("student man", 40, 40)}
                  time="5 days ago"
                  content="The internet safety module was really helpful! I've already started implementing the tips."
                  replies={2}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start a New Discussion</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lesson Preview */}
      {activeLesson && (
        <Card>
          <CardHeader>
            <CardTitle>Lesson Preview</CardTitle>
            <CardDescription>{course.lessons.find((l) => l.id === activeLesson)?.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md relative">
              <div className="relative w-full h-full rounded-md overflow-hidden">
                <Image
                  src={lessonImage}
                  alt="Lesson Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Button className="bg-vikasini-orange hover:bg-vikasini-orange/90 rounded-full h-12 w-12 p-0">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Previous Lesson</Button>
            <Button>Next Lesson</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function LessonItem({ lesson, isActive, onClick }: LessonItemProps) {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "quiz":
        return <FileText className="h-4 w-4" />;
      case "assignment":
        return <FileText className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
        isActive ? "bg-muted" : "hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-1 rounded-full ${
            lesson.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
          }`}
        >
          {lesson.completed ? <CheckCircle className="h-4 w-4" /> : getLessonIcon(lesson.type)}
        </div>
        <div>
          <div className="font-medium">{lesson.title}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>{lesson.type}</span>
            <span>•</span>
            <span>{lesson.duration}</span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        {lesson.completed ? "Review" : "Start"}
      </Button>
    </div>
  )
}

function DiscussionPost({ user, avatar, time, content, replies }: DiscussionPostProps) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar || getUnsplashImage("person profile", 40, 40)} alt={user} />
          <AvatarFallback>{user.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user}</div>
          <div className="text-xs text-muted-foreground">{time}</div>
        </div>
      </div>
      <p className="text-sm mb-3">{content}</p>
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{replies} replies</div>
        <Button variant="link" size="sm" className="h-auto p-0 text-vikasini-orange">
          Reply
        </Button>
      </div>
    </div>
  )
}
