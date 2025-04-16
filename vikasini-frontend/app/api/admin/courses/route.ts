import { NextRequest, NextResponse } from 'next/server';

// Define types for our data structures
interface Course {
  _id?: string;
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: number;
  category: string;
  image?: string;
  progress?: number;
  status?: string;
}

// Helper function to get courses from localStorage or default to initial set
function getStoredCourses(): Course[] {
  // Check if we're on server or client
  if (typeof window === 'undefined') {
    // Server-side - use default courses
    return getDefaultCourses();
  }
  
  // Client-side - try to get from localStorage
  try {
    const storedCourses = localStorage.getItem('vikasini-admin-courses');
    if (storedCourses) {
      return JSON.parse(storedCourses);
    }
  } catch (error) {
    console.error('Error retrieving courses from localStorage:', error);
  }
  
  // If no courses in localStorage or there was an error, return defaults
  return getDefaultCourses();
}

// Helper function to save courses to localStorage
function saveCourses(courses: Course[]) {
  // Only save if we're on client-side
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('vikasini-admin-courses', JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving courses to localStorage:', error);
    }
  }
}

// Default courses function
function getDefaultCourses(): Course[] {
  return [
    {
      _id: '1',
      id: 'digital-literacy-basics',
      title: 'Digital Literacy Basics',
      description: 'Learn the fundamentals of using digital devices, navigating the internet, and basic computer operations.',
      level: 'Beginner',
      duration: '8 hours',
      lessons: 10,
      category: 'Digital Skills',
      image: '/courses/digital-literacy.jpg',
      progress: 0,
      status: 'Not Started'
    },
    {
      _id: '2',
      id: 'office-productivity-suite',
      title: 'Office Productivity Suite',
      description: 'Master essential office applications like word processing, spreadsheets, and presentations.',
      level: 'Intermediate',
      duration: '12 hours',
      lessons: 8,
      category: 'Office Skills',
      image: '/courses/office-productivity.jpg',
      progress: 0,
      status: 'Not Started'
    },
    {
      _id: '3',
      id: 'effective-communication',
      title: 'Effective Communication',
      description: 'Develop strong verbal and written communication skills for professional environments.',
      level: 'Beginner',
      duration: '6 hours',
      lessons: 6,
      category: 'Soft Skills',
      image: '/courses/communication.jpg',
      progress: 0,
      status: 'Not Started'
    }
  ];
}

// Initialize courses from storage or defaults
let courses = getDefaultCourses();

// Try to initialize courses from localStorage if called on client side
if (typeof window !== 'undefined') {
  courses = getStoredCourses();
}

// Function to connect to the backend API
// In a production environment, this would make actual HTTP requests to your backend
async function fetchFromBackend(endpoint: string, options: any = {}) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000/api';
  
  try {
    // For now, we'll just use our mock data
    // In production, uncomment this code to make real API calls
    /*
    const response = await fetch(`${backendUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    return await response.json();
    */
    
    // For development, simulate API responses with our mock data
    return { success: true };
  } catch (error) {
    console.error('Error connecting to backend:', error);
    throw error;
  }
}

// GET handler to retrieve all courses or a specific course by ID
export async function GET(request: NextRequest) {
  try {
    // Ensure we have the latest courses from storage
    if (typeof window !== 'undefined') {
      courses = getStoredCourses();
    }
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
    
    if (courseId) {
      // Return a specific course
      const course = courses.find(c => c.id === courseId || c._id === courseId);
      
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      
      return NextResponse.json(course);
    }
    
    // Optional filtering by category
    const category = searchParams.get('category');
    let filteredCourses = courses;
    
    if (category) {
      filteredCourses = courses.filter(course => course.category === category);
    }
    
    // Return all courses
    return NextResponse.json(filteredCourses);
  } catch (error) {
    console.error('Error in courses GET API:', error);
    return NextResponse.json({ error: 'Failed to retrieve courses' }, { status: 500 });
  }
}

// POST handler to create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.level || !body.duration || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // In production, would call the backend API
    // await fetchFromBackend('/courses', { method: 'POST', body: JSON.stringify(body) });
    
    // Generate a slug-like ID if not provided
    if (!body.id) {
      body.id = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // For now, we'll just add to our mock database
    const newCourse: Course = {
      _id: `${courses.length + 1}`,
      ...body,
      progress: 0,
      status: 'Not Started'
    };
    
    courses.push(newCourse);
    
    // Save updated courses to localStorage
    saveCourses(courses);
    
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error in courses POST API:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

// DELETE handler to delete a course
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
    
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    
    // Check if course exists
    const courseIndex = courses.findIndex(c => c.id === courseId || c._id === courseId);
    
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    // In production, would call the backend API
    // await fetchFromBackend(`/courses/${courseId}`, { method: 'DELETE' });
    
    // Remove from our mock database
    courses.splice(courseIndex, 1);
    
    // Save updated courses to localStorage
    saveCourses(courses);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in courses DELETE API:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}

// PUT handler to update a course
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
    const body = await request.json();
    
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    
    // Check if course exists
    const courseIndex = courses.findIndex(c => c.id === courseId || c._id === courseId);
    
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    // In production, would call the backend API
    // await fetchFromBackend(`/courses/${courseId}`, { method: 'PUT', body: JSON.stringify(body) });
    
    // Update in our mock database
    courses[courseIndex] = {
      ...courses[courseIndex],
      ...body
    };
    
    // Save updated courses to localStorage
    saveCourses(courses);
    
    return NextResponse.json(courses[courseIndex]);
  } catch (error) {
    console.error('Error in courses PUT API:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
} 