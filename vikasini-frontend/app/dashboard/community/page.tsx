"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Search, Share2, Users } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getUnsplashImage } from "@/lib/utils"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("discussions")
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Meera K.",
        avatar: getUnsplashImage("indian woman professional", 40, 40),
        level: "Level 4",
        location: "Mumbai",
      },
      content:
        "Just completed the Data Entry certification! So happy with what I've learned. The Excel formulas section was challenging but worth it. Has anyone used these skills to get a job yet?",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
      isLiked: false,
      tags: ["Data Entry", "Certification", "Excel"],
    },
    {
      id: 2,
      user: {
        name: "Anjali T.",
        avatar: getUnsplashImage("indian woman professional", 40, 40),
        level: "Level 3",
        location: "Bangalore",
      },
      content:
        "I got my first freelance job through the platform! It's a small data entry project, but I'm so excited to start. Thank you Vikasini for the skills and the opportunity!",
      time: "5 hours ago",
      likes: 42,
      comments: 15,
      isLiked: true,
      tags: ["Success Story", "Freelance", "First Job"],
    },
    {
      id: 3,
      user: {
        name: "Lakshmi R.",
        avatar: getUnsplashImage("indian woman professional", 40, 40),
        level: "Level 5",
        location: "Chennai",
      },
      content:
        "I'm organizing a study group for the digital literacy course. We'll meet online twice a week to practice and help each other. Anyone interested can comment below or message me directly!",
      time: "1 day ago",
      likes: 18,
      comments: 12,
      isLiked: false,
      tags: ["Study Group", "Digital Literacy", "Peer Learning"],
    },
    {
      id: 4,
      user: {
        name: "Priyanka M.",
        avatar: getUnsplashImage("indian woman professional", 40, 40),
        level: "Level 3",
        location: "Delhi",
      },
      content:
        "Sharing my notes from the communication skills module. Hope it helps others who are working through this course! The section on professional emails was particularly useful for me.",
      time: "2 days ago",
      likes: 35,
      comments: 7,
      isLiked: false,
      tags: ["Notes", "Communication Skills", "Resources"],
    },
  ])

  // Filter posts based on search query
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: posts.length + 1,
        user: {
          name: "Priya Sharma",
          avatar: getUnsplashImage("indian woman professional", 40, 40),
          level: "Level 3",
          location: "Your Location",
        },
        content: newPostContent,
        time: "Just now",
        likes: 0,
        comments: 0,
        isLiked: false,
        tags: [],
      }

      setPosts([newPost, ...posts])
      setNewPostContent("")
      setIsSubmitting(false)

      toast({
        title: "Post published!",
        description: "Your post has been shared with the community.",
      })
    }, 1000)
  }

  const handleLikePost = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post,
      ),
    )
    toast({
      title: "Success",
      description: "Post liked successfully",
    })
  }

  return (
    <div className="space-y-6">
      {/* Toast notification container */}
      <Toaster />
      
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community</h1>
            <p className="text-muted-foreground">Connect with other learners, share experiences, and grow together</p>
          </div>
          
          {/* Cuties sprite */}
          <div className="hidden md:block">
            <div className="animate-wave">
              <img 
                src="/cuties.png" 
                alt="Vikasini Community" 
                className="w-60 h-60 object-contain" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle>Create a Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getUnsplashImage("profile person woman", 40, 40)} alt="Your Avatar" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share something with the community..."
                    className="mb-3"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      className="bg-vikasini-orange hover:bg-vikasini-orange/90 text-white"
                      onClick={handleSubmitPost}
                      disabled={!newPostContent.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="discussions">All Discussions</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="success">Success Stories</TabsTrigger>
                  <TabsTrigger value="study">Study Groups</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative ml-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user.avatar || getUnsplashImage("profile person", 40, 40)} alt={post.user.name} />
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.user.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{post.user.level}</span>
                          <span>•</span>
                          <span>{post.user.location}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mb-3">{post.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 ${post.isLiked ? "text-vikasini-orange" : ""}`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${post.isLiked ? "fill-vikasini-orange text-vikasini-orange" : ""}`}
                        />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No posts match your search criteria"
                    : "Be the first to start a discussion in this category"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Members</span>
                <span className="font-bold">1,245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Posts This Week</span>
                <span className="font-bold">87</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Study Groups</span>
                <span className="font-bold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Stories</span>
                <span className="font-bold">156</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Study Groups */}
          <Card>
            <CardHeader>
              <CardTitle>Active Study Groups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StudyGroupCard
                title="Excel Formulas Mastery"
                members={12}
                schedule="Tuesdays & Thursdays, 7 PM"
                category="Office Skills"
              />
              <StudyGroupCard
                title="Communication Skills Practice"
                members={8}
                schedule="Mondays & Wednesdays, 6 PM"
                category="Soft Skills"
              />
              <StudyGroupCard
                title="Job Interview Preparation"
                members={15}
                schedule="Fridays, 5 PM"
                category="Career Development"
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Study Groups
              </Button>
            </CardFooter>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                #RemoteWorkTips
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                #FirstJobSuccess
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                #ExcelTricks
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                #InterviewPrep
              </Button>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Be respectful and supportive of all members</p>
              <p>• Share knowledge and help others learn</p>
              <p>• No spam or self-promotion</p>
              <p>• Keep discussions relevant to learning and career development</p>
              <p>• Report inappropriate content to moderators</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface StudyGroupCardProps {
  title: string;
  members: number;
  schedule: string;
  category: string;
}

function StudyGroupCard({ title, members, schedule, category }: StudyGroupCardProps) {
  return (
    <div className="p-3 border rounded-lg">
      <h3 className="font-medium mb-1">{title}</h3>
      <div className="text-xs text-muted-foreground mb-2">
        <div className="flex items-center gap-1 mb-1">
          <Users className="h-3 w-3" />
          <span>{members} members</span>
        </div>
        <div>{schedule}</div>
      </div>
      <Badge variant="outline" className="text-xs">
        {category}
      </Badge>
    </div>
  )
}
