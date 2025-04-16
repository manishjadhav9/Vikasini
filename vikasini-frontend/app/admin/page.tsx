"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart } from "@/components/ui/chart"
import { BookOpen, Briefcase, Download, Users } from "lucide-react"
import { MetricCard } from "@/components/ui/metric-card"
import { ResponsiveContainer, LineChart, BarChart, XAxis, YAxis, CartesianGrid, Line, Bar, Tooltip } from "recharts"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month")

  // Mock data for charts
  const userActivityData = [
    { name: "Jan", active: 120, new: 45 },
    { name: "Feb", active: 132, new: 52 },
    { name: "Mar", active: 145, new: 58 },
    { name: "Apr", active: 160, new: 63 },
    { name: "May", active: 178, new: 72 },
    { name: "Jun", active: 195, new: 80 },
    { name: "Jul", active: 220, new: 95 },
  ]

  const courseCompletionData = [
    { name: "Digital Literacy", completed: 85, inProgress: 120 },
    { name: "Data Entry", completed: 65, inProgress: 95 },
    { name: "Communication", completed: 45, inProgress: 75 },
    { name: "Customer Service", completed: 35, inProgress: 60 },
    { name: "Excel Basics", completed: 55, inProgress: 85 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform metrics and user activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="1,245"
          change="+12.5%"
          description="vs. previous period"
          icon={<Users className="h-5 w-5 text-vikasini-orange" />}
        />
        <MetricCard
          title="Active Courses"
          value="24"
          change="+4"
          description="new this month"
          icon={<BookOpen className="h-5 w-5 text-vikasini-orange" />}
        />
        <MetricCard
          title="Job Placements"
          value="87"
          change="+23.4%"
          description="vs. previous period"
          icon={<Briefcase className="h-5 w-5 text-vikasini-orange" />}
        />
        <MetricCard
          title="Course Completion Rate"
          value="68%"
          change="+5.2%"
          description="vs. previous period"
          icon={<BookOpen className="h-5 w-5 text-vikasini-orange" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active and new users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="#FF7A00" strokeWidth={2} name="Active Users" />
                  <Line type="monotone" dataKey="new" stroke="#1A1A1A" strokeWidth={2} name="New Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course Completion</CardTitle>
            <CardDescription>Completed vs. in-progress courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseCompletionData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#FF7A00" name="Completed" />
                  <Bar dataKey="inProgress" fill="#1A1A1A" name="In Progress" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="jobs">Job Placements</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Age Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>18-24</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span>25-34</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span>35-44</span>
                      <span>18%</span>
                    </div>
                    <Progress value={18} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span>45+</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Urban</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span>Semi-urban</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span>Rural</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Daily Active Users</span>
                  <span className="font-bold">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Session Duration</span>
                  <span className="font-bold">32 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Retention Rate (30 days)</span>
                  <span className="font-bold">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Community Participation Rate</span>
                  <span className="font-bold">42%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Most Popular Course</span>
                  <span className="font-bold">Digital Literacy Fundamentals</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Highest Completion Rate</span>
                  <span className="font-bold">Excel Basics (82%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lowest Completion Rate</span>
                  <span className="font-bold">Advanced Communication (45%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Course Rating</span>
                  <span className="font-bold">4.7/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Course Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Digital Skills</span>
                  <span>35%</span>
                </div>
                <Progress value={35} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Office Skills</span>
                  <span>28%</span>
                </div>
                <Progress value={28} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Soft Skills</span>
                  <span>22%</span>
                </div>
                <Progress value={22} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Language Skills</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobs" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Placement Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Job Applications</span>
                  <span className="font-bold">342</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Successful Placements</span>
                  <span className="font-bold">87 (25.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Salary</span>
                  <span className="font-bold">₹18,500/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Remote Work Percentage</span>
                  <span className="font-bold">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Job Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Data Entry</span>
                  <span>32%</span>
                </div>
                <Progress value={32} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Virtual Assistant</span>
                  <span>24%</span>
                </div>
                <Progress value={24} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Customer Support</span>
                  <span>18%</span>
                </div>
                <Progress value={18} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Content Writing</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Others</span>
                  <span>11%</span>
                </div>
                <Progress value={11} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Platform Rating</span>
                  <span className="font-bold">4.8/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Course Content Rating</span>
                  <span className="font-bold">4.7/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Mentor Rating</span>
                  <span className="font-bold">4.6/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
