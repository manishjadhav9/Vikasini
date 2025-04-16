// API service for making requests to the backend

// Base URL for API calls
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || response.statusText;
    return Promise.reject(error);
  }
  
  return data;
};

// Authentication API
export const authAPI = {
  // Register a new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    interests: string[];
  }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
  
  // Login user
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    return handleResponse(response);
  },
  
  // Update user language preference
  updateLanguage: async (preferredLanguage: string, token: string) => {
    const response = await fetch(`${API_URL}/auth/update-language`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ preferredLanguage }),
    });
    
    return handleResponse(response);
  },
};

// User API
export const userAPI = {
  // Get current user profile
  getProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Update user profile
  updateProfile: async (userId: string, updates: {
    name?: string;
    email?: string;
    preferredLanguage?: string;
    skills?: { name: string; level: number }[];
    interests?: string[];
    profileImage?: string;
  }, token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
  
  // Get user's courses
  getCourses: async (token: string) => {
    const response = await fetch(`${API_URL}/users/my-courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Enroll in a course
  enrollCourse: async (courseId: string, token: string) => {
    const response = await fetch(`${API_URL}/users/enroll/${courseId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Update course progress
  updateCourseProgress: async (courseId: string, progress: number, token: string) => {
    const response = await fetch(`${API_URL}/users/update-progress/${courseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ progress }),
    });
    
    return handleResponse(response);
  },
  
  // Get user's job applications
  getApplications: async (token: string) => {
    const response = await fetch(`${API_URL}/users/my-applications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Apply for a job
  applyForJob: async (jobId: string, token: string) => {
    const response = await fetch(`${API_URL}/users/apply/${jobId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Course API
export const courseAPI = {
  // Get all courses
  getAllCourses: async (query = '') => {
    const response = await fetch(`${API_URL}/courses${query}`, {
      method: 'GET',
    });
    
    return handleResponse(response);
  },
  
  // Get a single course
  getCourse: async (courseId: string) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: 'GET',
    });
    
    return handleResponse(response);
  },
  
  // Get course lessons
  getCourseLessons: async (courseId: string, token: string) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/lessons`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Get a specific lesson
  getCourseLesson: async (courseId: string, lessonId: string, token: string) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/lessons/${lessonId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Admin: Create a course
  createCourse: async (courseData: any, token: string) => {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    
    return handleResponse(response);
  },
  
  // Admin: Update a course
  updateCourse: async (courseId: string, courseData: any, token: string) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    
    return handleResponse(response);
  },
  
  // Admin: Delete a course
  deleteCourse: async (courseId: string, token: string) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Job API
export const jobAPI = {
  // Get all jobs
  getAllJobs: async (query = '') => {
    const response = await fetch(`${API_URL}/jobs${query}`, {
      method: 'GET',
    });
    
    return handleResponse(response);
  },
  
  // Get a single job
  getJob: async (jobId: string) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'GET',
    });
    
    return handleResponse(response);
  },
  
  // Get matching jobs for user
  getMatchingJobs: async (token: string) => {
    const response = await fetch(`${API_URL}/jobs/match/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Admin: Create a job
  createJob: async (jobData: any, token: string) => {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    
    return handleResponse(response);
  },
  
  // Admin: Update a job
  updateJob: async (jobId: string, jobData: any, token: string) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    
    return handleResponse(response);
  },
  
  // Admin: Delete a job
  deleteJob: async (jobId: string, token: string) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
}; 