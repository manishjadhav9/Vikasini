"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Calendar, Clock, Medal, Star, Trophy, Users } from "lucide-react"

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: "Fast Learner",
      description: "Complete 5 lessons in a day",
      icon: <Trophy className="h-8 w-8 text-vikasini-orange" />,
      earned: true,
      date: "May 15, 2023",
      category: "learning",
      xp: 50,
    },
    {
      id: 2,
      title: "Consistent Effort",
      description: "Login for 7 consecutive days",
      icon: <Calendar className="h-8 w-8 text-vikasini-orange" />,
      earned: true,
      date: "May 10, 2023",
      category: "engagement",
      xp: 75,
    },
    {
      id: 3,
      title: "Quiz Master",
      description: "Score 100% in 3 quizzes",
      icon: <Star className="h-8 w-8 text-vikasini-orange" />,
      earned: true,
      date: "April 28, 2023",
      category: "learning",
      xp: 100,
    },
    {
      id: 4,
      title: "Course Champion",
      description: "Complete your first course",
      icon: <Trophy className="h-8 w-8 text-gray-300" />,
      earned: false,
      progress: 75,
      category: "learning",
      xp: 150,
    },
    {
      id: 5,
      title: "Community Helper",
      description: "Answer 5 questions in the community",
      icon: <Users className="h-8 w-8 text-gray-300" />,
      earned: false,
      progress: 40,
      category: "community",
      xp: 75,
    },
    {
      id: 6,
      title: "Early Bird",
      description: "Complete a lesson before 8 AM",
      icon: <Clock className="h-8 w-8 text-vikasini-orange" />,
      earned: true,
      date: "May 5, 2023",
      category: "engagement",
      xp: 25,
    },
    {
      id: 7,
      title: "Night Owl",
      description: "Complete a lesson after 10 PM",
      icon: <Clock className="h-8 w-8 text-vikasini-orange" />,
      earned: true,
      date: "May 8, 2023",
      category: "engagement",
      xp: 25,
    },
    {
      id: 8,
      title: "First Job Application",
      description: "Apply for your first job through the platform",
      icon: <Award className="h-8 w-8 text-gray-300" />,
      earned: false,
      progress: 0,
      category: "career",
      xp: 100,
    },
    {
      id: 9,
      title: "Skill Master",
      description: "Achieve proficiency in 3 different skills",
      icon: <Medal className="h-8 w-8 text-gray-300" />,
      earned: false,
      progress: 67,
      category: "learning",
      xp: 200,
    },
    {
      id: 10,
      title: "Study Group Leader",
      description: "Create and lead a study group with 5+ members",
      icon: <Users className="h-8 w-8 text-gray-300" />,
      earned: false,
      progress: 20,
      category: "community",
      xp: 150,
    },
    {
      id: 11,
      title: "Perfect Attendance",
      description: "Complete all scheduled lessons for a month",
      icon: <Calendar className="h-8 w-8 text-gray-300" />,
      earned: false,
      progress: 80,
      category: "engagement",
      xp: 125,
    },
    {
      id: 12,
      title: "Knowledge Sharer",
      description: "Share your notes or resources with the community",
      icon: <BookOpen className="h-8 w-8 text-vikasini-orange" />,
      earned: true,
      date: "May 12, 2023",
      category: "community",
      xp: 50,
    },
  ]

  // Filter achievements based on active tab
  const filteredAchievements = achievements.filter((achievement) => {
    if (activeTab === "all") return true
    if (activeTab === "earned") return achievement.earned
    if (activeTab === "inprogress") return !achievement.earned && achievement.progress > 0
    if (activeTab === "locked") return !achievement.earned && (!achievement.progress || achievement.progress === 0)
    return achievement.category === activeTab
  })

  // Calculate stats
  const totalAchievements = achievements.length
  const earnedAchievements = achievements.filter((a) => a.earned).length
  const totalXP = achievements.filter((a) => a.earned).reduce((sum, a) => sum + a.xp, 0)
  const nextLevel = 1500
  const currentLevel = 3
  const xpProgress = (totalXP / nextLevel) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">Track your progress and earn rewards for your learning journey</p>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentLevel}</div>
            <p className="text-xs text-muted-foreground">{totalXP} XP earned</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Next Level: {currentLevel + 1}</span>
                <span>
                  {totalXP}/{nextLevel} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Achievements Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {earnedAchievements}/{totalAchievements}
            </div>
            <p className="text-xs text-muted-foreground">
              {((earnedAchievements / totalAchievements) * 100).toFixed(0)}% complete
            </p>
            <div className="mt-2">
              <Progress value={(earnedAchievements / totalAchievements) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Achievement</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="bg-vikasini-orange/10 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-vikasini-orange" />
            </div>
            <div>
              <div className="font-medium">Fast Learner</div>
              <p className="text-xs text-muted-foreground">Earned on May 15, 2023</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Achievement</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="bg-muted p-2 rounded-full">
              <Trophy className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">Course Champion</div>
              <p className="text-xs text-muted-foreground">75% progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Tabs and Grid */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AchievementCard({ achievement }) {
  return (
    <Card className={`border ${achievement.earned ? "border-vikasini-orange" : "border-gray-200"}`}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className={`mb-3 ${achievement.earned ? "" : "opacity-30"}`}>{achievement.icon}</div>
        <h3 className="font-bold mb-1">{achievement.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>

        {achievement.earned ? (
          <>
            <Badge className="mb-1 bg-vikasini-orange">Earned</Badge>
            <p className="text-xs text-muted-foreground">On {achievement.date}</p>
          </>
        ) : achievement.progress > 0 ? (
          <div className="w-full space-y-1 mt-2">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{achievement.progress}%</span>
            </div>
            <Progress value={achievement.progress} className="h-2" />
          </div>
        ) : (
          <Badge variant="outline" className="opacity-70">
            Locked
          </Badge>
        )}

        <div className="mt-2 text-xs font-medium text-vikasini-orange">+{achievement.xp} XP</div>
      </CardContent>
    </Card>
  )
}
