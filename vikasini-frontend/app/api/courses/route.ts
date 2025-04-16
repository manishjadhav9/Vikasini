import { NextRequest, NextResponse } from 'next/server';

// Forward requests to the admin courses API but ensure we're working with the same data
export async function GET(request: NextRequest) {
  try {
    // Re-route to admin API
    const adminUrl = new URL(request.url);
    adminUrl.pathname = adminUrl.pathname.replace('/api/courses', '/api/admin/courses');
    
    // First try getting data directly from localStorage if available (client-side)
    if (typeof window !== 'undefined') {
      try {
        const storedCourses = localStorage.getItem('vikasini-admin-courses');
        if (storedCourses) {
          const courses = JSON.parse(storedCourses);
          // Apply any filters from the original request
          const { searchParams } = new URL(request.url);
          const category = searchParams.get('category');
          
          if (category) {
            const filteredCourses = courses.filter((course: any) => course.category === category);
            return NextResponse.json(filteredCourses);
          }
          
          return NextResponse.json(courses);
        }
      } catch (error) {
        console.error('Error retrieving courses from localStorage:', error);
        // Continue to fetch from admin API if localStorage fails
      }
    }
    
    // Fallback: fetch from admin API (especially for server-side rendering)
    const response = await fetch(adminUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in public courses API:', error);
    return NextResponse.json({ error: 'Failed to retrieve courses' }, { status: 500 });
  }
} 