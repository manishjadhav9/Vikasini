'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LearningPathType } from '@/hooks/useLearningPath'
import { useAuth } from '@/lib/AuthContext'
import { 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Clock, 
  ChevronsRight,
  Star
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'

interface PathProgressTrackerProps {
  path: LearningPathType | null
  currentMilestone: number
  onMilestoneChange: (milestone: number) => void
}

export function PathProgressTracker({
  path,
  currentMilestone,
  onMilestoneChange
}: PathProgressTrackerProps) {
  const { user } = useAuth()
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [relatedInterests, setRelatedInterests] = useState<string[]>([])
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
  
  // Map interest IDs to their full names
  const getInterestLabel = (interestId: string) => {
    const mapping: Record<string, string> = {
      digital_literacy: 'Digital Literacy',
      data_entry: 'Data Entry',
      communication: 'Communication Skills',
      customer_service: 'Customer Service',
      content_writing: 'Content Writing',
      basic_programming: 'Basic Programming',
      office_tools: 'Office Tools',
      social_media: 'Social Media Management',
    }
    return mapping[interestId] || interestId
  }
  
  // Find interests related to current milestone
  useEffect(() => {
    if (!path || !user?.interests || currentMilestone === undefined) return
    
    const currentMilestoneData = path.milestones[currentMilestone]
    if (!currentMilestoneData) return
    
    const milestoneText = [
      currentMilestoneData.title.toLowerCase(),
      currentMilestoneData.description.toLowerCase(),
      ...(currentMilestoneData.skills || []).map(s => s.toLowerCase())
    ].join(' ')
    
    const userInterestLabels = user.interests.map(getInterestLabel)
    const related = userInterestLabels.filter(interest => 
      milestoneText.includes(interest.toLowerCase())
    )
    
    setRelatedInterests(related)
  }, [path, currentMilestone, user])
  
  // Fetch user's existing progress on component mount
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user || !path) return
      
      try {
        // Determine a valid user ID - handle simulation case
        const userId = user._id || 'simulated-user-1'
        
        const response = await fetch(`/api/learning-paths/progress?userId=${userId}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.progress && typeof data.progress.currentMilestone === 'number') {
            // Only update if different from current value
            if (data.progress.currentMilestone !== currentMilestone) {
              onMilestoneChange(data.progress.currentMilestone)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error)
      }
    }
    
    fetchUserProgress()
  }, [user, path, onMilestoneChange, currentMilestone])
  
  if (!path || !personalizedPath) return null
  
  // Calculate overall progress percentage
  const totalMilestones = personalizedPath.milestones.length
  const progressPercentage = Math.round((currentMilestone / totalMilestones) * 100)
  
  // Save the current progress to the API
  const saveProgress = async (milestone: number) => {
    if (!user) return
    
    setIsSaving(true)
    
    try {
      // Determine a valid user ID - handle simulation case
      const userId = user._id || 'simulated-user-1'
      
      const response = await fetch('/api/learning-paths/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentMilestone: milestone,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
      
      console.log('Progress saved successfully')
    } catch (error) {
      console.error('Failed to save progress:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your progress. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handle moving to next milestone
  const handleAdvance = () => {
    if (currentMilestone < totalMilestones - 1) {
      setIsAdvancing(true)
      
      // Simulate a delay for the progress to update
      setTimeout(async () => {
        const newMilestone = currentMilestone + 1
        onMilestoneChange(newMilestone)
        
        // Save progress to API
        await saveProgress(newMilestone)
        
        setIsAdvancing(false)
        toast({
          title: "Milestone Completed!",
          description: `You've advanced to: ${personalizedPath.milestones[newMilestone].title}`,
        })
      }, 1000)
    }
  }
  
  // Handle moving to previous milestone
  const handleRetreat = async () => {
    if (currentMilestone > 0) {
      const newMilestone = currentMilestone - 1
      onMilestoneChange(newMilestone)
      
      // Save progress to API
      await saveProgress(newMilestone)
    }
  }
  
  return (
    <div className="bg-white border rounded-lg p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-vikasini-orange" />
          Your Learning Progress
        </h3>
        <div className="text-sm font-medium">
          {progressPercentage}% Complete
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-5" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Current Milestone: {currentMilestone + 1} of {totalMilestones}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetreat}
            disabled={currentMilestone === 0 || isAdvancing || isSaving}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleAdvance}
            disabled={currentMilestone >= totalMilestones - 1 || isAdvancing || isSaving}
            className="bg-vikasini-orange hover:bg-vikasini-orange/90"
          >
            {isAdvancing || isSaving ? (
              <>Processing...</>
            ) : (
              <>
                {currentMilestone < totalMilestones - 1 ? 'Mark Complete' : 'All Complete'} 
                <ChevronsRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Current milestone indicator */}
      <div className="mt-3 text-sm">
        <span className="font-medium">Current focus:</span>{' '}
        <span className="text-vikasini-orange font-medium">
          {personalizedPath.milestones[currentMilestone].title}
        </span>
      </div>
      
      {/* Display related interests */}
      {relatedInterests.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1 mb-1 text-sm">
            <Star className="h-4 w-4 text-vikasini-orange" />
            <span className="font-medium">Related to your interests:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedInterests.map((interest, index) => (
              <Badge key={index} variant="outline" className="bg-vikasini-orange/10 text-vikasini-orange border-vikasini-orange/30">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 