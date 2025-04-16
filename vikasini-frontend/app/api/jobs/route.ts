import { NextRequest, NextResponse } from 'next/server';

// Define types for our data structures
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  description: string;
  requirements: string[];
  salary: string;
  hours: string;
  postedDate: string;
  skillMatch: number;
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  skills: string;
  coverLetter: string;
  resumeUrl: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
}

// Mock database for job listings
const jobs: Job[] = [
  {
    id: '1',
    title: 'Data Entry Specialist',
    company: 'TechSolutions Inc.',
    location: 'Remote',
    type: 'remote',
    description: 'We are looking for a detail-oriented Data Entry Specialist to join our team. You will be responsible for entering data from various sources into our database with high accuracy and efficiency.',
    requirements: [
      'Basic computer skills and familiarity with data entry software',
      'Typing speed of at least 40 WPM with 95% accuracy',
      'Attention to detail and ability to maintain accuracy while working quickly',
      'High school diploma or equivalent',
      'Basic knowledge of MS Excel'
    ],
    salary: 'Rs. 15,000 - 20,000 per month',
    hours: 'Full-time, 40 hours per week',
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    skillMatch: 95
  },
  {
    id: '2',
    title: 'Customer Support Associate',
    company: 'SupportHub',
    location: 'Hybrid (2 days in office, 3 days remote)',
    type: 'hybrid',
    description: 'Join our customer support team to assist clients with product inquiries, troubleshooting, and general assistance. You\'ll be the friendly voice that helps customers resolve their issues.',
    requirements: [
      'Excellent communication skills in English (spoken and written)',
      'Basic computer skills and ability to learn new software',
      'Patient and empathetic approach to customer problems',
      'High school diploma or equivalent',
      'Previous customer service experience preferred but not required'
    ],
    salary: 'Rs. 18,000 - 25,000 per month',
    hours: 'Full-time, flexible shifts',
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    skillMatch: 85
  },
  {
    id: '3',
    title: 'Virtual Assistant',
    company: 'GlobalServices Ltd.',
    location: 'Remote',
    type: 'remote',
    description: 'We are seeking a reliable Virtual Assistant to provide administrative support to our executives. Tasks include email management, scheduling, data entry, and basic research.',
    requirements: [
      'Strong organizational and time management skills',
      'Proficiency in MS Office (Word, Excel, PowerPoint, Outlook)',
      'Good written and verbal communication skills',
      'Ability to work independently with minimal supervision',
      'High school diploma or equivalent; some college preferred'
    ],
    salary: 'Rs. 20,000 - 30,000 per month',
    hours: 'Part-time, 20-30 hours per week',
    postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    skillMatch: 75
  },
  {
    id: '4',
    title: 'Content Writing Assistant',
    company: 'ContentCraft',
    location: 'Remote',
    type: 'remote',
    description: 'Looking for a Content Writing Assistant to help with creating blog posts, social media content, and email newsletters. This is a perfect opportunity for someone who enjoys writing and wants to develop their skills.',
    requirements: [
      'Good written communication skills in English',
      'Basic understanding of SEO principles',
      'Ability to research topics and summarize information',
      'Attention to detail and ability to follow content guidelines',
      'High school diploma or equivalent'
    ],
    salary: 'Rs. 15,000 - 25,000 per month (based on experience)',
    hours: 'Part-time, flexible hours',
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    skillMatch: 70
  },
  {
    id: '5',
    title: 'Administrative Assistant',
    company: 'BusinessSolutions Inc.',
    location: 'Onsite - Mumbai',
    type: 'onsite',
    description: 'Administrative Assistant needed to support our office operations. Responsibilities include document management, scheduling, basic accounting tasks, and reception duties.',
    requirements: [
      'Prior experience in an administrative role preferred',
      'Proficiency in MS Office applications',
      'Excellent organizational and multitasking abilities',
      'Professional communication skills',
      'High school diploma required; some college preferred'
    ],
    salary: 'Rs. 18,000 - 22,000 per month',
    hours: 'Full-time, 9 AM - 5 PM, Monday - Friday',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    skillMatch: 65
  }
];

// Mock database for job applications
let applications: JobApplication[] = [];

// GET handler to retrieve all jobs or a specific job by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (jobId) {
      // Return a specific job
      const job = jobs.find(j => j.id === jobId);
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      
      return NextResponse.json({ job });
    }
    
    // Optional filtering by job type
    const type = searchParams.get('type');
    let filteredJobs = jobs;
    
    if (type) {
      filteredJobs = jobs.filter(job => job.type === type);
    }
    
    // Return all jobs (could add pagination here in a real app)
    return NextResponse.json({ jobs: filteredJobs });
  } catch (error) {
    console.error('Error in jobs GET API:', error);
    return NextResponse.json({ error: 'Failed to retrieve jobs' }, { status: 500 });
  }
}

// POST handler to submit a job application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      jobId, 
      fullName, 
      email, 
      phone, 
      experience, 
      skills, 
      coverLetter, 
      resumeUrl 
    } = body;
    
    // Validate required fields
    if (!jobId || !fullName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if job exists
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // Create a new application
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      company: job.company,
      fullName,
      email,
      phone,
      experience: experience || 'Not specified',
      skills: skills || 'Not specified',
      coverLetter: coverLetter || 'Not provided',
      resumeUrl: resumeUrl || null,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    
    // Add to mock database
    applications.push(newApplication);
    
    return NextResponse.json({ 
      application: newApplication, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    console.error('Error in job application POST API:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

// GET handler to retrieve applications for a user
export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Filter applications by user email
    const userApplications = applications.filter(app => app.email === email);
    
    return NextResponse.json({ applications: userApplications });
  } catch (error) {
    console.error('Error in applications GET API:', error);
    return NextResponse.json({ error: 'Failed to retrieve applications' }, { status: 500 });
  }
} 