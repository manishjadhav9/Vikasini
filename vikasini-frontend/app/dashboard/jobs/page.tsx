"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Calendar, Clock, Download, Filter, MapPin, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { useAuth } from "@/lib/AuthContext"
import { generateResumeForDownload } from "@/lib/utils"

// Helper function to format match percentage with translation
function formatMatchPercentage(t: (key: string) => any, matchPercent: number): string {
  const translationKey = 'jobs.match';
  const translation = t(translationKey);
  const fallback = `${matchPercent}% Match`;
  
  if (typeof translation === 'string' && translation.includes('{percent}')) {
    return translation.replace('{percent}', matchPercent.toString());
  }
  
  return fallback;
}

// Define job type
interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  posted: string
  deadline: string
  description: string
  requirements: string[]
  skills: string[]
  match: number
  applications: number
  category: string
}

export default function JobsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [jobCategory, setJobCategory] = useState("all")
  const [jobType, setJobType] = useState("all")

  // Mock job data
  const jobs: Job[] = [
    {
      id: 1,
      title: t('jobs.dataentry') || "Data Entry Specialist",
      company: t('companies.techsolutions') || "TechSolutions Inc.",
      location: t('jobs.types.remote') || "Remote",
      type: "Full-time",
      salary: "₹15,000 - ₹20,000/month",
      posted: "2 days ago",
      deadline: "30 days remaining",
      description:
        "We are looking for a detail-oriented Data Entry Specialist to join our team. The ideal candidate will be responsible for entering data into our system, ensuring accuracy and maintaining databases.",
      requirements: [
        "Basic computer skills",
        "Attention to detail",
        "Good typing speed (40+ WPM)",
        "Proficiency in Microsoft Excel",
        "Good command of English",
      ],
      skills: ["Data Entry", "Microsoft Excel", "Typing", "English"],
      match: 95,
      applications: 24,
      category: "Office Skills",
    },
    {
      id: 2,
      title: t('jobs.virtual') || "Virtual Assistant",
      company: t('companies.globalservices') || "GlobalServices Ltd.",
      location: t('jobs.types.remote') || "Remote",
      type: "Part-time",
      salary: "₹200 - ₹300/hour",
      posted: "5 days ago",
      deadline: "15 days remaining",
      description:
        "We are seeking a reliable Virtual Assistant to provide administrative support to our executives. Tasks include email management, scheduling, and basic customer service.",
      requirements: [
        "Excellent communication skills",
        "Proficiency in Google Workspace or Microsoft Office",
        "Good time management",
        "Basic customer service experience",
        "Fluent in English",
      ],
      skills: ["Email Management", "Calendar Management", "Customer Service", "English"],
      match: 85,
      applications: 42,
      category: "Administrative",
    },
    {
      id: 3,
      title: t('jobs.customer') || "Customer Support Associate",
      company: t('companies.supporthub') || "SupportHub",
      location: t('jobs.types.hybrid') || "Hybrid",
      type: "Full-time",
      salary: "₹18,000 - ₹25,000/month",
      posted: "1 week ago",
      deadline: "20 days remaining",
      description:
        "Join our customer support team to assist customers with their inquiries via chat and email. You will be responsible for resolving customer issues and ensuring customer satisfaction.",
      requirements: [
        "Excellent written and verbal communication",
        "Problem-solving skills",
        "Patience and empathy",
        "Basic technical knowledge",
        "Fluent in English and Hindi",
      ],
      skills: ["Customer Service", "Communication", "Problem Solving", "English", "Hindi"],
      match: 75,
      applications: 56,
      category: "Customer Service",
    },
    {
      id: 4,
      title: "Content Writer",
      company: "ContentCraft",
      location: t('jobs.types.remote') || "Remote",
      type: "Freelance",
      salary: "₹2 - ₹3 per word",
      posted: "3 days ago",
      deadline: "Ongoing",
      description:
        "We are looking for creative Content Writers to create engaging content for our clients' websites, blogs, and social media platforms. Topics will vary across different industries.",
      requirements: [
        "Excellent writing skills in English",
        "Ability to research topics",
        "SEO knowledge is a plus",
        "Creativity and originality",
        "Ability to meet deadlines",
      ],
      skills: ["Content Writing", "Copywriting", "Research", "SEO", "English"],
      match: 65,
      applications: 38,
      category: "Writing",
    },
    {
      id: 5,
      title: "Social Media Assistant",
      company: "DigitalMarketing Co.",
      location: t('jobs.types.remote') || "Remote",
      type: "Part-time",
      salary: "₹12,000 - ₹15,000/month",
      posted: "1 week ago",
      deadline: "10 days remaining",
      description:
        "We're looking for a Social Media Assistant to help manage our clients' social media accounts. Responsibilities include creating and scheduling posts, engaging with followers, and basic analytics.",
      requirements: [
        "Familiarity with major social media platforms",
        "Basic graphic design skills",
        "Good writing and communication",
        "Understanding of social media trends",
        "Ability to work independently",
      ],
      skills: ["Social Media", "Content Creation", "Communication", "Basic Design", "English"],
      match: 70,
      applications: 45,
      category: "Digital Marketing",
    },
    {
      id: 6,
      title: "Data Analyst Intern",
      company: "DataInsights",
      location: t('jobs.types.remote') || "Remote",
      type: "Internship",
      salary: "₹8,000 - ₹10,000/month",
      posted: "4 days ago",
      deadline: "14 days remaining",
      description:
        "Looking for a Data Analyst Intern to help with data collection, cleaning, and basic analysis. This is a great opportunity to gain experience in data analytics.",
      requirements: [
        "Basic knowledge of Excel or Google Sheets",
        "Interest in data analysis",
        "Attention to detail",
        "Basic math skills",
        "Willingness to learn",
      ],
      skills: ["Data Analysis", "Excel", "Data Entry", "Basic Statistics"],
      match: 80,
      applications: 32,
      category: "Data",
    },
  ]

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = jobCategory === "all" || job.category.toLowerCase().includes(jobCategory.toLowerCase())
    const matchesType = jobType === "all" || job.type.toLowerCase() === jobType.toLowerCase()

    return matchesSearch && matchesCategory && matchesType
  })

  const handleApply = () => {
    setIsApplying(true)

    // Simulate API call
    setTimeout(() => {
      setIsApplying(false)
      setSelectedJob(null)

      toast({
        title: "Application submitted!",
        description: "Your application has been successfully submitted.",
      })
    }, 1500)
  }

  const getMatchBadgeColor = (match: number) => {
    if (match >= 90) return "bg-green-500"
    if (match >= 75) return "bg-green-400"
    if (match >= 60) return "bg-amber-400"
    return "bg-gray-400"
  }

  // Job categories
  const categories = [
    {
      title: "Office Skills",
      count: jobs.filter((job) => job.category === "Office Skills").length,
      icon: <Briefcase className="h-10 w-10 p-2 rounded-full bg-amber-100 text-amber-600" />,
    },
    {
      title: "Customer Service",
      count: jobs.filter((job) => job.category === "Customer Service").length,
      icon: <Briefcase className="h-10 w-10 p-2 rounded-full bg-blue-100 text-blue-600" />,
    },
    {
      title: "Writing",
      count: jobs.filter((job) => job.category === "Writing").length,
      icon: <Briefcase className="h-10 w-10 p-2 rounded-full bg-green-100 text-green-600" />,
    },
    {
      title: "Data",
      count: jobs.filter((job) => job.category === "Data").length,
      icon: <Briefcase className="h-10 w-10 p-2 rounded-full bg-purple-100 text-purple-600" />,
    },
    {
      title: "Digital Marketing",
      count: jobs.filter((job) => job.category === "Digital Marketing").length,
      icon: <Briefcase className="h-10 w-10 p-2 rounded-full bg-pink-100 text-pink-600" />,
    },
    {
      title: "Administrative",
      count: jobs.filter((job) => job.category === "Administrative").length,
      icon: <Briefcase className="h-10 w-10 p-2 rounded-full bg-cyan-100 text-cyan-600" />,
    },
  ]

  // Function to render the job match badge
  const renderMatchBadge = (job: Job) => {
    const matchBadgeColor = getMatchBadgeColor(job.match);
    return (
      <div className="flex flex-col items-end gap-1">
        <Badge className={`${matchBadgeColor} text-white`}>
          {formatMatchPercentage(t, job.match)}
        </Badge>
        <p className="text-xs text-muted-foreground">
          {job.applications} {t('jobs.applicants')}
        </p>
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{t('jobs.opportunities') || "Job Opportunities"}</h1>
        <p className="text-gray-500">{t('jobs.description') || "Find remote and flexible jobs that match your skills"}</p>

        {/* Job search and filters section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="pl-10"
              placeholder={t('jobs.search') || "Search jobs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {/* Resume Generation Button */}
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                if (user) {
                  generateResumeForDownload(user)
                }
              }}
            >
              <Download size={18} />
              Generate Resume
            </Button>
            
            {/* Category filter */}
            <Select value={jobCategory} onValueChange={setJobCategory}>
              <SelectTrigger className="w-full md:w-[160px]">
                <Filter size={16} className="mr-2" />
                <span>{jobCategory === "all" ? (t('jobs.all_categories') || "All Categories") : jobCategory}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('jobs.all_categories') || "All Categories"}</SelectItem>
                <SelectItem value="Office Skills">Office Skills</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Writing">Writing</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
                <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
              </SelectContent>
            </Select>

            {/* Type filter */}
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full md:w-[160px]">
                <Clock size={16} className="mr-2" />
                <span>{jobType === "all" ? (t('jobs.all_types') || "All Types") : jobType}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('jobs.all_types') || "All Types"}</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{t('jobs.tab.all') || "All Jobs"}</TabsTrigger>
            <TabsTrigger value="recommended">{t('jobs.tab.recommended') || "Recommended"}</TabsTrigger>
            <TabsTrigger value="applied">{t('jobs.tab.applied') || "Applied"}</TabsTrigger>
            <TabsTrigger value="saved">{t('jobs.tab.saved') || "Saved"}</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.title} {...category} />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('jobs.recent') || "Recent Opportunities"}</h2>
                <Button variant="ghost" size="sm">
                  {t('dashboard.view.all') || "View all"} ({jobs.length})
                </Button>
              </div>

              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      matchBadgeColor={getMatchBadgeColor(job.match)}
                      onView={() => setSelectedJob(job)}
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-semibold">No jobs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="recommended">
            <div className="space-y-4">
              {filteredJobs
                .filter((job) => job.match >= 70)
                .map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    matchBadgeColor={getMatchBadgeColor(job.match)}
                    onView={() => setSelectedJob(job)}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="applied">
            <div className="flex flex-col items-center justify-center text-center p-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">{t('jobs.no.applications') || "No applications yet"}</h3>
              <p className="text-muted-foreground mb-6">{t('jobs.start.applying') || "Start applying to jobs and track your applications here"}</p>
              <Button onClick={() => document.getElementById("all")?.click()}>{t('jobs.browse.opportunities') || "Browse Opportunities"}</Button>
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="flex flex-col items-center justify-center text-center p-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">{t('jobs.no.saved') || "No saved jobs"}</h3>
              <p className="text-muted-foreground mb-6">{t('jobs.start.saving') || "Save jobs you're interested in to apply later"}</p>
              <Button onClick={() => document.getElementById("all")?.click()}>{t('jobs.browse.opportunities') || "Browse Opportunities"}</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Job details dialog */}
        {selectedJob && (
          <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                <DialogDescription className="text-base font-medium text-foreground">
                  {selectedJob.company}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedJob.location}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {selectedJob.type}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedJob.salary}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {selectedJob.posted}
                </Badge>
                <Badge className={`${getMatchBadgeColor(selectedJob.match)}`}>
                  {formatMatchPercentage(t, selectedJob.match)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('jobs.description') || "Description"}</h3>
                  <p className="text-sm">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('jobs.requirements') || "Requirements"}</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('jobs.skills') || "Skills"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex sm:justify-between gap-y-2">
                <div className="text-sm text-muted-foreground">
                  {selectedJob.applications} {t('jobs.applications.sent') || "applications sent"} • {selectedJob.deadline}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedJob(null)}>
                    {t('jobs.close') || "Close"}
                  </Button>
                  <Button asChild>
                    <Link href={`/dashboard/jobs/${selectedJob.id}/apply`}>
                      {t('jobs.apply.now') || "Apply Now"}
                    </Link>
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

interface JobCardProps {
  job: Job
  matchBadgeColor: string
  onView: () => void
}

function JobCard({ job, onView, matchBadgeColor }: JobCardProps) {
  const { t } = useLanguage()
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="font-bold">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <Badge className={`${matchBadgeColor}`}>
              {formatMatchPercentage(t, job.match)}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {job.type}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.salary}
            </Badge>
          </div>

          <p className="text-sm line-clamp-2 mb-4">{job.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{job.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="border-t px-6 py-3 flex justify-between items-center bg-muted/20">
          <div className="text-sm text-muted-foreground">
            {job.posted} • {job.applications} {t('jobs.applications.sent') || "applications"}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/jobs/${job.id}`}>
                {t('jobs.view.details') || "View Details"}
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/dashboard/jobs/${job.id}/apply`}>
                {t('jobs.apply.now') || "Apply"}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CategoryCardProps {
  title: string
  count: number
  icon: React.ReactNode
}

function CategoryCard({ title, count, icon }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          {icon}
          <span className="text-lg font-bold">{count}</span>
        </div>
        <h3 className="font-semibold mt-4">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "job" : "jobs"} available
        </p>
      </CardContent>
    </Card>
  )
}
