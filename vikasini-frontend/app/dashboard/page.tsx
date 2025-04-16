"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Briefcase, ChevronRight, Clock, Headphones, Play, Trophy, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart, LineChart, BarChart, XAxis, YAxis, CartesianGrid } from "@/components/ui/chart"
import { Line } from "recharts"
import { Bar } from "recharts"
import { useLanguage } from "@/lib/LanguageContext"
import { useAuth } from "@/lib/AuthContext"
import { LearningPathCard } from "@/components/learning-path/LearningPathCard"
import { LearningPathRoadmap } from "@/components/learning-path/LearningPathRoadmap"
import { PathProgressTracker } from "@/components/learning-path/PathProgressTracker"
import { EditPathDialog } from "@/components/learning-path/EditPathDialog"
import { useLearningPath, LearningPathType } from "@/hooks/useLearningPath"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getUnsplashImage } from "@/lib/utils"

export default function Dashboard() {
  const { language, setLanguage, t } = useLanguage()
  const { user, isLoading: isUserLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { 
    path, 
    isLoading: isPathLoading, 
    isGenerating,
    generateLearningPath,
    updateLearningPath,
    fetchLearningPath
  } = useLearningPath()
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'roadmap'>('roadmap');
  const [pathGeneratedAt, setPathGeneratedAt] = useState<string | null>(null);
  const [generationAttempts, setGenerationAttempts] = useState(0);
  const maxGenerationAttempts = 3;

  // Auto-retry generation if it's stuck for too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (isGenerating) {
      // If still generating after 15 seconds, retry up to maxGenerationAttempts times
      timeoutId = setTimeout(() => {
        if (generationAttempts < maxGenerationAttempts) {
          console.log(`Generation seems stuck, retrying (attempt ${generationAttempts + 1}/${maxGenerationAttempts})`);
          setGenerationAttempts(prev => prev + 1);
          generateLearningPath();
        } else {
          console.log('Max generation attempts reached. Please try again later.');
          toast({
            title: "Generation timeout",
            description: "We're having trouble generating your learning path. Please try again.",
            variant: "destructive"
          });
        }
      }, 15000); // 15 seconds
    } else {
      // If we have a path, reset the generation attempts counter
      if (path) {
        setGenerationAttempts(0);
      }
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isGenerating, generationAttempts, path, generateLearningPath]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isUserLoading, isAuthenticated, router]);
  
  // Get first name only with better fallback handling
  const firstName = user?.name ? user.name.split(' ')[0] : 'Learner';

  // Handle path generation when the user has interests but no path
  useEffect(() => {
    // Only proceed if user is authenticated and not loading
    if (isUserLoading || !isAuthenticated) return;
    
    // Log user interests for debugging
    if (user && user.interests) {
      console.log('Current user interests:', user.interests);
      console.log('Interest count:', user.interests.length);
    }
    
    // We no longer need this check as it's handled in the useLearningPath hook
    // const isWrongUserPath = path && user && !isPathForCurrentUser(path);
    
    // if (isWrongUserPath) {
    //   console.log('Path appears to belong to another user. Regenerating...');
    //   toast({
    //     title: "Generating personalized path",
    //     description: `Creating a unique learning path just for you, ${firstName}.`,
    //   });
    //   regeneratePathForCurrentUser();
    //   setPathGeneratedAt(new Date().toISOString());
    //   return;
    // }
    
    const shouldGeneratePath = 
      !isPathLoading && 
      !isGenerating && 
      !path && 
      user && 
      user.interests && 
      user.interests.length > 0;
    
    if (shouldGeneratePath) {
      // Clear any existing path for this user to ensure a fresh one is generated
      console.log('Generating unique learning path for user with interests:', user.interests);
      toast({
        title: "Generating learning path",
        description: `Creating a personalized learning path for ${firstName} based on your interests.`,
      });
      generateLearningPath();
      setPathGeneratedAt(new Date().toISOString());
    } else if (user && user._id && !isPathLoading && !path) {
      // If we have a user but no path and no interests, fetch in case one exists
      console.log('Attempting to fetch learning path for user:', user._id);
      fetchLearningPath();
    }
  }, [isPathLoading, path, user, isGenerating, generateLearningPath, fetchLearningPath, isAuthenticated, isUserLoading, firstName]);

  // For debugging purposes - show who's logged in and their interests
  useEffect(() => {
    if (user) {
      console.log("Auth state in dashboard:", { 
        userName: user?.name,
        userInterests: user?.interests,
        isUserLoading,
        firstName 
      });
    }
  }, [user, isUserLoading, firstName]);

  const handleEditPath = () => {
    setIsEditDialogOpen(true);
  };

  const handleSavePath = async (updatedPath: LearningPathType) => {
    await updateLearningPath(updatedPath);
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Your learning path has been updated!",
    });
  };

  // Handle regeneration via button click
  const handleRegenerate = async () => {
    setGenerationAttempts(0); // Reset attempts counter
    toast({
      title: "Regenerating path",
      description: "Creating a new unique learning path for you...",
    });
    
    try {
      await generateLearningPath();
      setPathGeneratedAt(new Date().toISOString());
      
      // Show success message to user
      toast({
        title: "Success",
        description: "Your new learning path has been created successfully!",
      });
    } catch (error) {
      console.error("Failed to regenerate learning path:", error);
      
      // Show error message to user
      toast({
        title: "Error",
        description: "Failed to generate a new learning path. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Mock data for charts
  const progressData = [
    { name: t('days.mon') || "Mon", progress: 20 },
    { name: t('days.tue') || "Tue", progress: 35 },
    { name: t('days.wed') || "Wed", progress: 45 },
    { name: t('days.thu') || "Thu", progress: 60 },
    { name: t('days.fri') || "Fri", progress: 75 },
    { name: t('days.sat') || "Sat", progress: 85 },
    { name: t('days.sun') || "Sun", progress: 90 },
  ]

  const skillsData = [
    { name: t('skills.digital') || "Digital Literacy", value: 80 },
    { name: t('skills.communication') || "Communication", value: 65 },
    { name: t('skills.data') || "Data Entry", value: 90 },
    { name: t('skills.customer') || "Customer Service", value: 50 },
    { name: t('skills.content') || "Content Writing", value: 30 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle') || "Continue your learning journey. You're making great progress!"}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('language.label') || "Language:"}</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('language.select') || "Select language"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
              <SelectItem value="telugu">Telugu</SelectItem>
              <SelectItem value="marathi">Marathi</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Headphones className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Personalized Learning Path */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{t('dashboard.learning.path') || "AI Powered Personalized Path"}</h2>
            {user && (
              <p className="text-sm text-muted-foreground">
                Uniquely generated for {firstName}'s interests and career goals
                {pathGeneratedAt && ` • Generated on ${formatDate(pathGeneratedAt)}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(v) => setViewMode(v as 'card' | 'roadmap')} 
              className="w-[220px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">Card View</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditPath}>
                Customize
              </Button>
              {path && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <span className="h-4 w-4 border-2 border-vikasini-orange border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    'Regenerate'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {(isPathLoading || isGenerating) ? (
          <div className="bg-white border rounded-lg p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-vikasini-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl font-medium mb-2">
              {isGenerating 
                ? `Generating AI learning path for ${firstName}... ${generationAttempts > 0 ? `(Attempt ${generationAttempts + 1}/${maxGenerationAttempts})` : ''}`
                : `Loading ${firstName}'s learning path...`
              }
            </p>
            {isGenerating && (
              <div>
                <p className="text-muted-foreground mb-4">
                  Our AI is analyzing your interests and creating a personalized learning journey. This may take a moment...
                </p>
                {generationAttempts > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setGenerationAttempts(0);
                      fetchLearningPath();
                    }}
                  >
                    Cancel Generation
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : path ? (
          <>
            {/* Progress tracker component */}
            <PathProgressTracker 
              path={path} 
              currentMilestone={currentMilestone}
              onMilestoneChange={setCurrentMilestone}
            />
            
            {/* Learning path visualization based on view mode */}
            {viewMode === 'roadmap' ? (
              <LearningPathRoadmap path={path} currentMilestone={currentMilestone} />
            ) : (
              <LearningPathCard path={path} onEdit={handleEditPath} />
            )}
            
            <EditPathDialog 
              path={path}
              isOpen={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              onSave={handleSavePath}
              isLoading={isPathLoading}
            />
          </>
        ) : (
          <div className="bg-white border rounded-lg p-8 text-center">
            {user && user.interests && user.interests.length > 0 ? (
              <>
                <p className="mb-4">No learning path found. Our system may be having trouble generating one based on your interests.</p>
                <Button 
                  onClick={() => {
                    setGenerationAttempts(0);
                    generateLearningPath();
                  }} 
                  className="mt-2 bg-vikasini-orange hover:bg-vikasini-orange/90"
                >
                  Try Generating Again
                </Button>
              </>
            ) : (
              <>
                <p className="mb-4">You need to set your interests to generate a personalized learning path.</p>
                <Button 
                  asChild
                  className="mt-2 bg-vikasini-orange hover:bg-vikasini-orange/90"
                >
                  <Link href="/dashboard/profile">Update My Interests</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.learning.progress') || "Learning Progress"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.progress.week') || "+12% from last week"}</p>
            <div className="mt-4">
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.courses.completed') || "Courses Completed"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3/8</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.courses.inprogress') || "2 courses in progress"}</p>
            <div className="mt-4">
              <Progress value={37.5} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.xp.points') || "XP Points"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.xp.next') || "250 points to next level"}</p>
            <div className="mt-4">
              <Progress value={83} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('dashboard.continue.learning') || "Continue Learning"}</h2>
          <Button variant="link" asChild>
            <Link href="/dashboard/courses">
              {t('dashboard.view.all') || "View all courses"} <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            title={t('courses.digital') || "Digital Literacy Fundamentals"}
            progress={75}
            image="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=300&h=200&fit=crop&crop=entropy"
            time={t('courses.time.remaining').replace('{time}', "2h 15m") || "2h 15m remaining"}
            badge={t('courses.status.inprogress') || "In Progress"}
          />
          <CourseCard
            title={t('courses.data') || "Basic Data Entry Skills"}
            progress={40}
            image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop&crop=entropy"
            time={t('courses.time.remaining').replace('{time}', "4h 30m") || "4h 30m remaining"}
            badge={t('courses.status.inprogress') || "In Progress"}
          />
          <CourseCard
            title={t('courses.communication') || "Communication Skills"}
            progress={0}
            image="https://images.unsplash.com/photo-1573496546620-c44559c46908?w=300&h=200&fit=crop&crop=entropy"
            time={t('courses.time.total').replace('{time}', "6h") || "6h total"}
            badge={t('courses.status.notstarted') || "Not Started"}
          />
        </div>
      </div>

      {/* Analytics and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.analytics.title') || "Your Learning Analytics"}</CardTitle>
            <CardDescription>{t('dashboard.analytics.description') || "Track your progress over the past week"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Chart>
                <LineChart data={progressData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="progress" stroke="#FF7A00" strokeWidth={2} dot={{ fill: "#FF7A00" }} />
                </LineChart>
              </Chart>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.skills.title') || "Skill Progress"}</CardTitle>
            <CardDescription>{t('dashboard.skills.description') || "Your current skill levels"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Chart>
                <BarChart data={skillsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="value" fill="#FF7A00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </Chart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Opportunities and Community */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.jobs.title') || "Recent Job Opportunities"}</CardTitle>
            <CardDescription>{t('dashboard.jobs.description') || "Matched based on your skills and interests"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <JobOpportunity
                title="Remote Data Entry Assistant"
                company="DataCorp Solutions"
                type="Part-time"
                match="85%"
              />
              <JobOpportunity
                title="Virtual Customer Support"
                company="GlobalServe Inc."
                type="Full-time"
                match="78%"
              />
              <JobOpportunity
                title="Digital Marketing Assistant"
                company="BrandBoost Media"
                type="Freelance"
                match="72%"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/jobs">
                {t('dashboard.view.more') || "View more opportunities"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.community.title') || "Community Discussions"}</CardTitle>
            <CardDescription>{t('dashboard.community.description') || "Connect with other learners"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CommunityPost
                user="Sneha Patel"
                avatar={getUnsplashImage("woman professional india SP", 40, 40)}
                time="2 hours ago"
                content="Just completed the Excel basics course. The templates are so useful for my work!"
                replies={5}
              />
              <CommunityPost
                user="Anjali Sharma"
                avatar={getUnsplashImage("woman professional india AS", 40, 40)}
                time="Yesterday"
                content="Anyone else having trouble with the data visualization module? I'm stuck on assignment 3."
                replies={12}
              />
              <CommunityPost
                user="Meera Rajput"
                avatar={getUnsplashImage("woman professional india MR", 40, 40)}
                time="3 days ago"
                content="I got my first freelance job thanks to the portfolio we created in the communication skills course!"
                replies={28}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/community">
                {t('dashboard.join.discussion') || "Join the discussion"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t('dashboard.achievements.title') || "Recent Achievements"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AchievementCard
            title="Quick Learner"
            description="Completed 3 lessons in a single day"
            icon={<Trophy className="h-10 w-10 text-vikasini-orange" />}
            earned={true}
          />
          <AchievementCard
            title="Digital Explorer"
            description="Completed the Digital Literacy module"
            icon={<Trophy className="h-10 w-10 text-vikasini-orange" />}
            earned={true}
          />
          <AchievementCard
            title="Consistent Student"
            description="Logged in for 7 consecutive days"
            icon={<Trophy className="h-10 w-10 text-vikasini-orange" />}
            earned={true}
          />
          <AchievementCard
            title="Master Communicator"
            description="Score 90% on the communication assessment"
            icon={<Trophy className="h-10 w-10 text-muted" />}
            earned={false}
          />
        </div>
      </div>

      {/* Add cutie_namastey.png sprite with wavy animation */}
      <div className="fixed bottom-4 right-4 z-10">
        <div className="animate-wave">
          <img 
            src="/cutie_namastey.png" 
            alt="Vikasini Assistant" 
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>
    </div>
  )
}

function CourseCard({ 
  title, 
  progress, 
  image, 
  time, 
  badge 
}: { 
  title: string;
  progress: number;
  image: string;
  time: string;
  badge: string;
}): React.ReactNode {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-4 text-white">
              <Badge className="mb-2 bg-vikasini-orange text-white">
                {badge}
              </Badge>
              <h3 className="font-semibold text-lg">{title}</h3>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" /> {time}
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <Button className="w-full bg-vikasini-orange hover:bg-vikasini-orange/90">
            <Play className="mr-2 h-4 w-4" /> Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function JobOpportunity({ 
  title, 
  company, 
  type, 
  match 
}: {
  title: string;
  company: string;
  type: string;
  match: string;
}): React.ReactNode {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3 hover:border-vikasini-orange hover:bg-muted/20 transition-colors">
      <div>
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{company}</span>
          <span className="mx-2">•</span>
          <span>{type}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Badge variant="outline" className="bg-vikasini-orange/10 text-vikasini-orange border-vikasini-orange/30">
          {match} Match
        </Badge>
        <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-1">
          View
        </Button>
      </div>
    </div>
  )
}

function CommunityPost({ 
  user, 
  avatar, 
  time, 
  content, 
  replies 
}: {
  user: string;
  avatar: string;
  time: string;
  content: string;
  replies: number;
}): React.ReactNode {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center mb-2">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={avatar} alt={user} />
          <AvatarFallback>{user.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{user}</div>
          <div className="text-xs text-muted-foreground">{time}</div>
        </div>
      </div>
      <p className="text-sm mb-2">{content}</p>
      <div className="flex items-center text-xs text-muted-foreground">
        <Users className="h-3 w-3 mr-1" />
        <span>{replies} replies</span>
      </div>
    </div>
  );
}

function AchievementCard({ 
  title, 
  description, 
  icon, 
  earned 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
}): React.ReactNode {
  return (
    <Card className={!earned ? "opacity-60" : undefined}>
      <CardContent className="p-4 text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-3">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {earned ? (
          <Badge className="mt-3 bg-vikasini-orange text-white">Earned</Badge>
        ) : (
          <Badge variant="outline" className="mt-3">In Progress</Badge>
        )}
      </CardContent>
    </Card>
  )
}
