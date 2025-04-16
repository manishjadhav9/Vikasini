'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, CheckCircle2, ChevronDown, ChevronUp, Clock, Edit, LayoutDashboard, 
  Loader2, Route, Star, Target, Trophy, Layers, Play 
} from 'lucide-react'
import { LearningPathType } from '@/hooks/useLearningPath'
import { useAuth } from '@/lib/AuthContext'
import { cn, getUnsplashImage } from '@/lib/utils'
import Link from 'next/link'

interface LearningPathProps {
  path: LearningPathType | null;
  onEdit?: () => void;
  isLoading?: boolean;
}

// Define extended milestone type to include potential interest_area
interface ExtendedMilestone {
  title: string;
  description: string;
  skills: string[];
  timeframe: string;
  project: string;
  interest_area?: string;
  level?: string;
  detectedInterestArea?: string;
}

export function LearningPathCard({ path, onEdit, isLoading = false }: LearningPathProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const { user } = useAuth();
  const userInterests = user?.interests || [];
  const firstName = user?.name ? user.name.split(' ')[0] : 'Your';
  
  // Helper function to personalize content by replacing any name with the current user's name
  const personalize = (text: string) => {
    if (!text) return text;
    
    // First, check if the text already contains the user's name
    if (text.toLowerCase().includes(firstName.toLowerCase())) {
      return text;
    }
    
    // Replace common names with the user's name
    const nameRegex = /\b(Ankita|Apurva|Priya|Meera|Sonia|Neha|Pooja)\b('s)?/gi;
    return text.replace(nameRegex, (match) => {
      return match.endsWith("'s") ? `${firstName}'s` : firstName;
    });
  };
  
  // Memoize the personalized path data to prevent unnecessary re-renders
  const personalizedPath = useMemo(() => {
    if (!path) return null;
    
    return {
      ...path,
      path_title: personalize(path.path_title),
      path_description: personalize(path.path_description),
      milestones: path.milestones.map(milestone => ({
        ...milestone,
        title: personalize(milestone.title),
        description: personalize(milestone.description)
      }))
    };
  }, [path, firstName]);
  
  // Map interest IDs to their full names for tag matching
  const interestLabels = userInterests.map(interest => {
    const mapping: Record<string, string> = {
      digital_literacy: 'Digital Literacy',
      data_entry: 'Data Entry',
      communication: 'Communication Skills',
      customer_service: 'Customer Service',
      content_writing: 'Content Writing',
      basic_programming: 'Basic Programming',
      office_tools: 'Office Tools',
      social_media: 'Social Media Management',
    };
    return mapping[interest] || interest;
  });
  
  // Helper function to find the interest area if not explicitly defined
  function findInterestArea(milestone: any, interests: string[]) {
    const milestoneText = [
      milestone.title.toLowerCase(),
      milestone.description.toLowerCase(),
      ...(milestone.skills || []).map((s: string) => s.toLowerCase())
    ].join(' ');
    
    for (const interest of interests) {
      if (milestoneText.includes(interest.toLowerCase())) {
        return interest;
      }
    }
    
    // Default if no match found
    return "Other Skills";
  }
  
  // Group milestones by interest area
  const groupedMilestones = useMemo(() => {
    if (!path) return {};
    
    const groups: Record<string, ExtendedMilestone[]> = {};
    
    path.milestones.forEach((milestone, index) => {
      // Use the interest_area property if available, otherwise try to infer it
      const milestoneWithPossibleInterest = milestone as ExtendedMilestone;
      const interestArea = milestoneWithPossibleInterest.interest_area || findInterestArea(milestone, interestLabels);
      
      if (!groups[interestArea]) {
        groups[interestArea] = [];
      }
      
      groups[interestArea].push({
        ...milestone, 
        detectedInterestArea: interestArea,
        level: milestoneWithPossibleInterest.level || (groups[interestArea].length === 0 ? 'Beginner' : 'Advanced')
      });
    });
    
    return groups;
  }, [path, interestLabels]);
  
  // Function to determine if a milestone is related to a specific user interest
  const getRelatedInterests = (milestone: any) => {
    const milestoneText = [
      milestone.title.toLowerCase(),
      milestone.description.toLowerCase(),
      ...milestone.skills.map((s: string) => s.toLowerCase())
    ].join(' ');
    
    return interestLabels.filter(interest => 
      milestoneText.includes(interest.toLowerCase())
    );
  };
  
  // Add this function inside the LearningPathCard component, after your existing functions
  const getMilestoneImage = (milestone: ExtendedMilestone) => {
    try {
      const interestArea = milestone.interest_area || milestone.detectedInterestArea || 'education';
      
      // Reliable image mappings based on interest area
      if (interestArea.includes('Digital Literacy')) {
        return "https://images.unsplash.com/photo-1611432579699-484f7990b127?w=400&h=200&fit=crop&crop=entropy";
      } else if (interestArea.includes('Data Entry')) {
        return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=entropy";
      } else if (interestArea.includes('Communication')) {
        return "https://images.unsplash.com/photo-1573496546620-c44559c46908?w=400&h=200&fit=crop&crop=entropy";
      } else if (interestArea.includes('Customer Service')) {
        return "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop&crop=entropy";
      } else if (interestArea.includes('Content Writing')) {
        return "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=200&fit=crop&crop=entropy";
      } else if (interestArea.includes('Programming')) {
        return "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=200&fit=crop&crop=entropy";
      } else if (interestArea.includes('Office')) {
        return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop&crop=entropy";
      } else if (interestArea.includes('Social Media')) {
        return "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=200&fit=crop&crop=entropy";
      }
      
      // Default fallback
      return "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=200&fit=crop&crop=entropy";
    } catch (error) {
      console.error("Error generating milestone image:", error);
      // Fallback to a reliable image URL
      return "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=200&fit=crop&crop=entropy";
    }
  }
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Route className="mr-2 h-5 w-5 text-vikasini-orange" />
            <span>Your Learning Path</span>
          </CardTitle>
          <CardDescription>Generating your personalized path...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-vikasini-orange animate-spin mb-4" />
            <p className="text-muted-foreground">Creating your tailored learning journey based on your interests...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (!path || !personalizedPath) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Route className="mr-2 h-5 w-5 text-vikasini-orange" />
            <span>Your Learning Path</span>
          </CardTitle>
          <CardDescription>Your personalized learning journey</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <p className="text-muted-foreground">No learning path found. Please update your interests to generate one.</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Route className="mr-2 h-5 w-5 text-vikasini-orange" />
              <span>{personalizedPath.path_title}</span>
            </CardTitle>
            <CardDescription>{personalizedPath.path_description}</CardDescription>

            {/* Uniqueness indicator */}
            <div className="mt-2 flex items-center">
              <Badge className="bg-vikasini-orange text-white text-xs">Unique Path</Badge>
              <span className="text-xs text-muted-foreground ml-2">Created exclusively for {firstName}'s specific interests</span>
            </div>

            {/* Display user's interests */}
            {userInterests.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground">Based on your interests:</span>
                {interestLabels.map((interest, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-vikasini-orange/10 border-vikasini-orange/30">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" /> Customize
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Display courses grouped by interest area */}
        {Object.entries(groupedMilestones).map(([interestArea, milestones], groupIndex) => (
          <div key={interestArea} className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Layers className="h-5 w-5 mr-2 text-vikasini-orange" />
              {interestArea} Courses
              <Badge className="ml-2 bg-vikasini-orange/60">{milestones.length} Courses</Badge>
            </h3>
            
            <div className="space-y-3">
              {milestones.map((milestone, index) => {
                const milestoneId = `${interestArea}-${index}`;
                const isExpanded = expandedMilestone === milestoneId;
                
                return (
                  <div 
                    key={milestoneId}
                    className={cn(
                      "border rounded-lg transition-all overflow-hidden",
                      milestone.level === 'Beginner' ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-purple-400'
                    )}
                  >
                    <div 
                      className={cn(
                        "p-4 flex justify-between items-center cursor-pointer",
                        isExpanded ? 'bg-muted/50' : ''
                      )}
                      onClick={() => setExpandedMilestone(isExpanded ? null : milestoneId)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-semibold",
                          milestone.level === 'Beginner' ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center">
                            {personalizedPath.milestones[index].title}
                          </h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {milestone.timeframe}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={milestone.level === 'Beginner' ? 'secondary' : 'outline'} className="mr-2">
                          {milestone.level}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 pt-0">
                        {/* Add image at the top of expanded content */}
                        <div className="relative aspect-video mb-4 rounded-md overflow-hidden">
                          <Image
                            src={getMilestoneImage(milestone)}
                            alt={milestone.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button 
                              className="bg-vikasini-orange hover:bg-vikasini-orange/90 rounded-full h-10 w-10 p-0"
                              asChild
                            >
                              <Link href={`/dashboard/courses`}>
                                <Play className="h-5 w-5" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                        
                        {/* Rest of the expanded content */}
                        <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
                        
                        <div className="mb-3">
                          <h5 className="font-medium mb-1">Skills You'll Learn:</h5>
                          <div className="flex flex-wrap gap-2">
                            {milestone.skills.map((skill, i) => (
                              <Badge key={i} variant="outline" className="bg-vikasini-orange/10">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{milestone.timeframe}</span>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="font-medium mb-1">Project:</h5>
                          <p className="text-sm text-muted-foreground">{milestone.project}</p>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            className="bg-vikasini-orange hover:bg-vikasini-orange/90 text-white"
                            asChild
                          >
                            <Link href="/dashboard/courses">
                              Start Course
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="pt-4">
          <h3 className="text-lg font-semibold flex items-center mb-3">
            <Trophy className="h-5 w-5 mr-2 text-vikasini-orange" />
            Career Opportunities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {path.career_opportunities.map((career, index) => {
              const isInterestRelated = interestLabels.some(interest => 
                (career.title + career.description).toLowerCase().includes(interest.toLowerCase())
              );
              
              return (
                <div 
                  key={index} 
                  className={cn(
                    "border rounded-lg p-4 hover:border-vikasini-orange/50 transition-colors",
                    isInterestRelated && "border-vikasini-orange/40 bg-vikasini-orange/5"
                  )}
                >
                  <h4 className="font-medium mb-1">{career.title}</h4>
                  <p className="text-sm text-muted-foreground">{career.description}</p>
                  {isInterestRelated && (
                    <Badge className="mt-2 bg-vikasini-orange/70 hover:bg-vikasini-orange text-white text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Matches Your Interests
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">Current Progress</p>
        </div>
        <div className="flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-1 text-vikasini-orange" />
          <span className="text-sm font-medium">0 of {path.milestones.length} courses completed</span>
        </div>
      </CardFooter>
    </Card>
  )
} 