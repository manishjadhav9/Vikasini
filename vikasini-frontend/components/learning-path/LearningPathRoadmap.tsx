'use client'

import React, { useMemo } from 'react'
import { LearningPathType } from '@/hooks/useLearningPath'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Star, 
  Target,
  BookOpen,
  Layers
} from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { cn } from '@/lib/utils'

interface LearningPathRoadmapProps {
  path: LearningPathType | null
  currentMilestone?: number
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

export function LearningPathRoadmap({ 
  path, 
  currentMilestone = 0 
}: LearningPathRoadmapProps) {
  if (!path) return null
  
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
  
  // Group milestones by interest area
  const groupedMilestones = useMemo(() => {
    const groups: Record<string, ExtendedMilestone[]> = {};
    
    personalizedPath.milestones.forEach(milestone => {
      // Use the interest_area property if available, otherwise try to infer it
      const milestoneWithPossibleInterest = milestone as ExtendedMilestone;
      const interestArea = milestoneWithPossibleInterest.interest_area || findInterestArea(milestone, interestLabels);
      
      if (!groups[interestArea]) {
        groups[interestArea] = [];
      }
      
      groups[interestArea].push({...milestone, detectedInterestArea: interestArea});
    });
    
    return groups;
  }, [personalizedPath.milestones, interestLabels]);
  
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
  
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-vikasini-orange" />
            {personalizedPath.path_title}
          </h3>
          <p className="text-muted-foreground">{personalizedPath.path_description}</p>
          
          {/* Uniqueness indicator */}
          <div className="mt-2 flex items-center">
            <Badge className="bg-vikasini-orange text-white">Unique Path</Badge>
            <span className="text-xs text-muted-foreground ml-2">Created exclusively for {firstName}'s specific interests</span>
          </div>
          
          {/* Display user's interests */}
          {userInterests.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Based on your interests:</span>
              {interestLabels.map((interest, i) => (
                <Badge key={i} variant="outline" className="bg-vikasini-orange/10 border-vikasini-orange/30">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative py-6">
          {/* Main roadmap line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-vikasini-orange to-blue-500 rounded-full" />
          
          {/* Milestones */}
          <div className="space-y-16">
            {personalizedPath.milestones.map((milestone, index) => {
              const relatedInterests = getRelatedInterests(milestone);
              const isInterestRelated = relatedInterests.length > 0;
              
              return (
                <div key={index} className="relative">
                  {/* Milestone node */}
                  <div className={cn(
                    "absolute left-4 w-8 h-8 rounded-full -ml-3.5 flex items-center justify-center",
                    index <= currentMilestone ? 'bg-vikasini-orange text-white' : 'bg-white border-2 border-gray-300 text-gray-500',
                    index < currentMilestone ? 'ring-2 ring-orange-100' : '',
                    isInterestRelated && 'ring-2 ring-vikasini-orange'
                  )}>
                    {index < currentMilestone ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Milestone content */}
                  <div className="ml-12 relative">
                    <div className={cn(
                      "p-4 rounded-lg border transition-all",
                      index === currentMilestone ? 'border-vikasini-orange/50 bg-orange-50/50 shadow-sm' : 'border-gray-200',
                      isInterestRelated && 'border-vikasini-orange/30 bg-vikasini-orange/5'
                    )}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{personalizedPath.milestones[index].title}</h4>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {isInterestRelated && (
                            <Badge className="bg-vikasini-orange/80 hover:bg-vikasini-orange text-white">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Interest Match
                            </Badge>
                          )}
                          <Badge className={
                            index < currentMilestone ? 'bg-green-500' : 
                            index === currentMilestone ? 'bg-vikasini-orange' : 'bg-gray-300'
                          }>
                            {index < currentMilestone ? 'Completed' : 
                             index === currentMilestone ? 'Current' : 'Upcoming'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="mb-3 text-muted-foreground">{personalizedPath.milestones[index].description}</p>
                      
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-vikasini-orange mt-0.5" />
                          <span className="text-sm">{milestone.timeframe}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-vikasini-orange mt-0.5" />
                          <span className="text-sm">{milestone.project}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-1 text-vikasini-orange" />
                          Skills You'll Gain
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.skills.map((skill, idx) => {
                            const isInterestSkill = interestLabels.some(interest => 
                              skill.toLowerCase().includes(interest.toLowerCase())
                            );
                            
                            return (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className={cn(
                                  "text-xs",
                                  isInterestSkill && "bg-vikasini-orange/20 border-vikasini-orange/30"
                                )}
                              >
                                {skill}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Show related interests if any */}
                      {relatedInterests.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-dashed border-vikasini-orange/30">
                          <div className="text-xs text-muted-foreground">Related to your interests:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {relatedInterests.map((interest, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-vikasini-orange/10 text-vikasini-orange/90">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Connector arrow to next milestone (except for the last one) */}
                    {index < personalizedPath.milestones.length - 1 && (
                      <div className="flex justify-center my-4">
                        <ChevronRight className="h-6 w-6 text-gray-400 transform rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Career opportunities section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Career Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {path.career_opportunities.map((career, index) => {
              const isInterestRelated = interestLabels.some(interest => 
                (career.title + career.description).toLowerCase().includes(interest.toLowerCase())
              );
              
              return (
                <Card 
                  key={index} 
                  className={cn(
                    "border border-gray-200 hover:border-vikasini-orange/50 transition-colors",
                    isInterestRelated && "border-vikasini-orange/30 bg-vikasini-orange/5"
                  )}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{career.title}</h4>
                    <p className="text-sm text-muted-foreground">{career.description}</p>
                    {isInterestRelated && (
                      <Badge className="mt-2 bg-vikasini-orange/80 hover:bg-vikasini-orange text-white">
                        Matches Your Interests
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 