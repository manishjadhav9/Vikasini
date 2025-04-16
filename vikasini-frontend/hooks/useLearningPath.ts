'use client'

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface LearningPathType {
  path_title: string;
  path_description: string;
  milestones: {
    title: string;
    description: string;
    skills: string[];
    timeframe: string;
    project: string;
  }[];
  career_opportunities: {
    title: string;
    description: string;
  }[];
}

export function useLearningPath() {
  const { user, isAuthenticated } = useAuth();
  const [path, setPath] = useState<LearningPathType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const lastPathTitleRef = useRef<string | null>(null);

  // Function to check if a path belongs to the current user
  const isPathForCurrentUser = (checkPath: LearningPathType | null): boolean => {
    if (!checkPath || !user || !user.name) return false;
    
    const firstName = user.name.split(' ')[0].toLowerCase();
    const pathTitle = checkPath.path_title.toLowerCase();
    
    // Check if the path title contains other names or not the current user's name
    const hasOtherNames = 
      (pathTitle.includes('ankita') && !firstName.includes('ankita')) ||
      (pathTitle.includes('apurva') && !firstName.includes('apurva')) ||
      (pathTitle.includes('priya') && !firstName.includes('priya')) ||
      (pathTitle.includes('meera') && !firstName.includes('meera')) ||
      (pathTitle.includes('sonia') && !firstName.includes('sonia'));
      
    const hasCurrentUserName = pathTitle.includes(firstName);
    
    // Store the last path title checked to prevent rechecking
    lastPathTitleRef.current = checkPath.path_title;
    
    return hasCurrentUserName && !hasOtherNames;
  };

  // Combined effect to handle path fetching and generation
  useEffect(() => {
    const fetchAndValidatePath = async () => {
      if (!user || !isAuthenticated) {
        setIsLoading(false);
        setPath(null);
        return;
      }
      
      const userId = user._id || 'simulated-user-1';
      
      // If we're already handling this user, don't repeat
      if (lastUserIdRef.current === userId && (isGeneratingRef.current || isGenerating)) {
        console.log('Already handling path for user:', userId);
        return;
      }
      
      // Update our tracking ref
      lastUserIdRef.current = userId;
      
      console.log('Fetching learning path for user ID:', userId);
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/learning-paths?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          const fetchedPath = data.path;
          console.log('Successfully fetched learning path for user:', userId);
          
          // Check if the path belongs to the current user
          if (fetchedPath && isPathForCurrentUser(fetchedPath)) {
            console.log('Path belongs to current user, using it');
            setPath(fetchedPath);
            setIsLoading(false);
          } else if (fetchedPath) {
            console.log('Path does not belong to current user, regenerating');
            // Only regenerate if we're not already generating
            if (!isGeneratingRef.current) {
              generateLearningPath();
            }
          } else {
            // No path found
            setPath(null);
            setIsLoading(false);
          }
        } else if (response.status === 404) {
          // If 404, clear any existing path
          console.log('No learning path found for user:', userId);
          setPath(null);
          setIsLoading(false);
          
          // If the user has interests, generate a path
          if (user.interests && user.interests.length > 0 && !isGeneratingRef.current) {
            console.log('User has interests, generating new path');
            generateLearningPath();
          }
        } else {
          // Other error
          console.error('Failed to fetch learning path:', await response.text());
          toast({
            title: 'Error',
            description: 'Failed to load your learning path',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Learning path fetch error:', error);
        setIsLoading(false);
      }
    };
    
    fetchAndValidatePath();
  }, [user, isAuthenticated]);

  // Delete an existing learning path for the current user
  const deleteLearningPath = async (): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    try {
      const userId = user._id || 'simulated-user-1';
      console.log('Deleting existing learning path for user:', userId);
      
      const response = await fetch(`/api/learning-paths?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('Successfully deleted learning path for user:', userId);
        setPath(null);
        return true;
      } else if (response.status === 404) {
        // If path not found, consider this a success since our goal is to ensure no path exists
        console.log('No existing path found to delete for user:', userId);
        setPath(null);
        return true;
      } else {
        const errorText = await response.text();
        console.error('Failed to delete learning path:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Learning path deletion error:', error);
      return false;
    }
  };

  // Generate a new learning path using the Gemini API
  const generateLearningPath = async () => {
    if (!user || !isAuthenticated || isGeneratingRef.current) return;
    
    setIsGenerating(true);
    isGeneratingRef.current = true;
    
    try {
      // Determine a valid user ID - handle simulation case
      const userId = user._id || 'simulated-user-1';
      
      // First, try to delete any existing path to ensure a fresh one
      try {
        await deleteLearningPath();
      } catch (deleteError) {
        // Log the error but continue - the goal is to create a new path
        console.warn('Failed to delete existing path, but will continue with generation:', deleteError);
      }
      
      console.log('Generating new learning path for user:', userId, 'with interests:', user.interests);
      
      // Create a unique identifier for this specific generation
      const uniqueGenerationId = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      console.log('Using unique generation ID:', uniqueGenerationId);
      
      // Call the Gemini API to generate the path with improved error handling
      const generateResponse = await fetch('/api/learning-paths/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          interests: user.interests,
          preferredLanguage: user.preferredLanguage,
          userId: userId,
          uniqueGenerationId: uniqueGenerationId,
          timestamp: new Date().toISOString(),
        }),
      });
      
      // Parse the response data first
      let generatedData;
      try {
        generatedData = await generateResponse.json();
      } catch (parseError) {
        console.error('Failed to parse generate response:', parseError);
        throw new Error('Failed to parse API response');
      }
      
      // Now check for errors or warnings in the response
      if (!generateResponse.ok) {
        let errorMessage = 'Failed to generate learning path';
        if (generatedData?.error) {
          errorMessage = generatedData.error;
          if (generatedData.details) {
            errorMessage += `: ${generatedData.details}`;
          }
        }
        console.error('Generate response error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      // Check if we got a path even with warnings
      if (generatedData.warning) {
        console.warn('Learning path generation warning:', generatedData.warning);
      }
      
      // Check that we have a valid path data structure
      if (!generatedData.path || !Array.isArray(generatedData.path.milestones)) {
        throw new Error('Invalid response from generate API - no valid path data');
      }
      
      console.log('Generated path:', generatedData.path);
      
      // Then, save the generated path for this user
      const saveResponse = await fetch('/api/learning-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          path: generatedData.path,
        }),
      });
      
      let savedData;
      try {
        savedData = await saveResponse.json();
      } catch (parseError) {
        console.error('Failed to parse save response:', parseError);
        throw new Error('Failed to save generated path');
      }
      
      if (!saveResponse.ok) {
        let errorMessage = 'Failed to save learning path';
        if (savedData?.error) {
          errorMessage = savedData.error;
          if (savedData.details) {
            errorMessage += `: ${savedData.details}`;
          }
        }
        console.error('Save response error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      // Store the last path title for success message
      lastPathTitleRef.current = savedData.path.path_title;
      
      // Update the learning path in state
      setPath(savedData.path);
      setIsGenerating(false);
      isGeneratingRef.current = false;
      
      // Show success notification
      toast({
        title: 'Success',
        description: `Created "${lastPathTitleRef.current}"`,
        variant: 'default',
        duration: 5000,
      });
      
      return savedData.path;
    } catch (error) {
      console.error('Error generating learning path:', error);
      setIsGenerating(false);
      isGeneratingRef.current = false;
      
      // Show error notification
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
      
      return null;
    }
  };

  // Regenerate a path if it belongs to the wrong user
  const regeneratePathForCurrentUser = async () => {
    if (!user || !isAuthenticated) return;
    
    // Don't regenerate if we're already generating
    if (isGeneratingRef.current || isGenerating) return;
    
    console.log('Regenerating path to ensure it belongs to current user:', user.name);
    await generateLearningPath();
  };

  // Update an existing learning path
  const updateLearningPath = async (updatedPath: LearningPathType) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Determine a valid user ID - handle simulation case
      const userId = user._id || 'simulated-user-1';
      
      const response = await fetch('/api/learning-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          path: updatedPath,
        }),
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to update learning path';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = `${errorMessage}: ${errorText || 'Unknown error'}`;
        }
        console.error('Update response error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setPath(data.path);
      
      toast({
        title: 'Success',
        description: 'Your learning path has been updated!',
      });
    } catch (error) {
      console.error('Error updating learning path:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update your learning path',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch without the complex logic for direct use
  const fetchLearningPath = async () => {
    if (!user || !isAuthenticated) return;
    
    setIsLoading(true);
    
    try {
      const userId = user._id || 'simulated-user-1';
      const response = await fetch(`/api/learning-paths?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setPath(data.path);
      } else if (response.status === 404) {
        setPath(null);
      }
    } catch (error) {
      console.error('Error fetching learning path:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    path,
    isLoading,
    isGenerating,
    fetchLearningPath,
    generateLearningPath,
    updateLearningPath,
    deleteLearningPath,
    regeneratePathForCurrentUser,
    isPathForCurrentUser
  };
} 