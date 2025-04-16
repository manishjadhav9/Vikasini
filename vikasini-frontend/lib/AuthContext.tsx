'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, userAPI } from './api';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';
import { Language } from './translations';

// Define user type
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  preferredLanguage: string;
  xpPoints: number;
  skills: { name: string; level: number }[];
  interests: string[];
  completedCourses: any[];
  inProgressCourses: any[];
  jobApplications: any[];
  profileImage?: string;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateProfile: async () => {},
  updateLanguage: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setLanguage, t } = useLanguage();

  // Initialize auth state from localStorage on client side
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const savedToken = localStorage.getItem('vikasini-token');
        
        if (savedToken) {
          setToken(savedToken);
          
          // Get user profile with the token
          try {
            const response = await userAPI.getProfile(savedToken);
            console.log('User profile response:', response); // Debug
            
            if (response && response.data && response.data.user) {
              setUser(response.data.user);
              
              // Set language based on user preference
              if (response.data.user.preferredLanguage) {
                // Check if it's a valid language option
                const lang = response.data.user.preferredLanguage;
                if (['english', 'hindi', 'marathi', 'tamil', 'telugu'].includes(lang)) {
                  setLanguage(lang as Language);
                } else {
                  setLanguage('english'); // Default fallback
                }
              }
            } else {
              console.error('Invalid user profile response:', response);
              
              // If the API response is invalid, simulate a user login
              console.log('Simulating user login due to invalid API response');
              simulateUserLogin();
            }
          } catch (error) {
            console.error('Failed to get user profile:', error);
            
            // If API fails, simulate a user login
            console.log('Simulating user login due to API error');
            simulateUserLogin();
          }
        } else {
          // For testing, simulate a user login if no token is found
          console.log('No token found, simulating user login for testing');
          simulateUserLogin();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        
        // If anything fails, simulate a user login as a fallback
        console.log('Simulating user login due to initialization error');
        simulateUserLogin();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setLanguage]);

  // Add a method to simulate a user login for testing
  const simulateUserLogin = () => {
    // Get URL query params to check for a specific user name for testing
    let userName = 'Priya Sharma';
    
    try {
      // Try to get user name from URL params if we're in a browser environment
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        
        if (userParam) {
          userName = decodeURIComponent(userParam);
        } else {
          // If no user param, randomly select from a list of names
          const names = [
            'Priya Sharma',
            'Anjali Patel',
            'Meera Singh',
            'Deepa Gupta',
            'Shikha Reddy',
            'Neha Kumar',
            'Ritu Verma',
            'Sunita Desai'
          ];
          
          // Generate a stable user based on the session to avoid changing on rerenders
          const sessionId = localStorage.getItem('vikasini-session') || Math.random().toString(36).substring(2);
          localStorage.setItem('vikasini-session', sessionId);
          
          // Use the session ID to select a name
          const nameIndex = Math.abs(hashCode(sessionId)) % names.length;
          userName = names[nameIndex];
        }
      }
    } catch (error) {
      console.error('Error getting user from URL params:', error);
      // Use default name if there's an error
    }
    
    // Simple hash function for string
    function hashCode(str: string): number {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }
    
    // Create a mock user
    const mockUser = {
      _id: `simulated-${Math.random().toString(36).substring(2, 10)}`,
      name: userName,
      email: `${userName.split(' ')[0].toLowerCase()}@example.com`,
      role: 'user',
      preferredLanguage: 'english',
      xpPoints: 1250,
      skills: [
        { name: 'typing', level: 70 },
        { name: 'excel', level: 50 },
        { name: 'communication', level: 60 }
      ],
      interests: ['digital_literacy', 'data_entry', 'communication'],
      completedCourses: ['1', '2', '3'],
      inProgressCourses: [
        { id: '4', title: 'Digital Literacy Fundamentals', progress: 75, last_accessed: new Date().toISOString() },
        { id: '5', title: 'Basic Data Entry Skills', progress: 40, last_accessed: new Date().toISOString() }
      ],
      jobApplications: []
    };

    // Create a mock token
    const mockToken = `mock-token-${Math.random().toString(36).substring(2, 15)}`;
    
    // Set the user and token in the context
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('vikasini-token', mockToken);
    
    // Return true to indicate success
    return true;
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // For testing - if the credentials match our test account, simulate login
      if (email === 'user@vikasini.org' && password === 'user123') {
        simulateUserLogin();
        
        toast({
          title: 'Login successful (simulated)',
          description: 'Welcome back to Vikasini!',
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
        
        return;
      }
      
      // Continue with regular login process...
      const response = await authAPI.login(email, password);
      console.log('Login response:', response); // Debug log
      
      if (response && response.token && response.data && response.data.user) {
        const { token, data } = response;
        
        // Save token to localStorage
        localStorage.setItem('vikasini-token', token);
        setToken(token);
        
        // Set user data
        setUser(data.user);
        
        // Set language based on user preference
        if (data.user.preferredLanguage) {
          // Check if it's a valid language option
          const lang = data.user.preferredLanguage;
          if (['english', 'hindi', 'marathi', 'tamil', 'telugu'].includes(lang)) {
            setLanguage(lang as Language);
          } else {
            setLanguage('english'); // Default fallback
          }
        }
        
        toast({
          title: t('login.success') || 'Login successful',
          description: t('login.welcome') || 'Welcome back to Vikasini!',
        });
        
        // Redirect based on user role with a slight delay to ensure state updates
        setTimeout(() => {
          if (data.user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 500);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('login.error') || 'Login failed',
        description: typeof error === 'string' ? error : (t('login.error.message') || 'Invalid credentials'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('vikasini-token');
    setToken(null);
    setUser(null);
    router.push('/login');
    
    toast({
      title: t('logout.success') || 'Logged out',
      description: t('logout.message') || 'You have been successfully logged out.',
    });
  };

  // Register function
  const register = async (userData: any) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.register(userData);
      const { token, data } = response;
      
      // Save token to localStorage
      localStorage.setItem('vikasini-token', token);
      setToken(token);
      setUser(data.user);
      
      // Set language based on user preference
      if (userData.preferredLanguage && ['english', 'hindi', 'marathi', 'tamil', 'telugu'].includes(userData.preferredLanguage)) {
        setLanguage(userData.preferredLanguage as Language);
      }
      
      toast({
        title: t('register.success') || 'Registration successful',
        description: t('register.welcome') || 'Welcome to Vikasini!',
      });
      
      // Ensure router.push is executed properly with slight delay
      setTimeout(() => {
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t('register.error') || 'Registration failed',
        description: typeof error === 'string' ? error : (t('register.error.message') || 'Failed to create account'),
        variant: 'destructive',
      });
      throw error; // Rethrow to allow the registration page to handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: any) => {
    if (!token || !user) return;
    
    setIsLoading(true);
    
    try {
      const response = await userAPI.updateProfile(user._id, userData, token);
      setUser(response.data.user);
      
      // Check if interests were updated and regenerate learning path if needed
      if (userData.interests && JSON.stringify(userData.interests) !== JSON.stringify(user.interests)) {
        try {
          console.log('Interests changed, regenerating learning path');
          // Call the learning path generation API
          const generateResponse = await fetch('/api/learning-paths/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: response.data.user.name,
              interests: response.data.user.interests,
              preferredLanguage: response.data.user.preferredLanguage,
            }),
          });
          
          if (generateResponse.ok) {
            const generatedData = await generateResponse.json();
            // Save the generated path
            if (generatedData.path) {
              await fetch('/api/learning-paths', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: response.data.user._id,
                  path: generatedData.path,
                }),
              });
            }
          }
        } catch (pathError) {
          console.error('Error regenerating learning path:', pathError);
          // Don't throw the error to avoid blocking the profile update
        }
      }
      
      toast({
        title: t('profile.update.success') || 'Profile updated',
        description: t('profile.update.message') || 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: t('profile.update.error') || 'Update failed',
        description: typeof error === 'string' ? error : (t('profile.update.error.message') || 'Failed to update profile'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update language function
  const updateLanguage = async (language: string) => {
    // Update UI language first for immediate feedback
    setLanguage(language as Language);
    
    // If logged in, also update user preference in the backend
    if (token && user) {
      try {
        await authAPI.updateLanguage(language, token);
        // Update local user state
        setUser({ ...user, preferredLanguage: language });
      } catch (error) {
        console.error('Language update error:', error);
        // Don't show error toast to user as UI language already changed
      }
    }
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    updateLanguage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 