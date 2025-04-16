import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory to store learning paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PATHS_DIR = path.join(DATA_DIR, 'learning-paths');

// Create directories if they don't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
  console.log(`Created data directory at ${DATA_DIR}`);
}
if (!fs.existsSync(PATHS_DIR)) {
  fs.mkdirSync(PATHS_DIR);
  console.log(`Created learning paths directory at ${PATHS_DIR}`);
}

// Helper function to read learning path for a user
function getLearningPath(userId: string) {
  const filePath = path.join(PATHS_DIR, `${userId}.json`);
  
  if (!fs.existsSync(filePath)) {
    // For simulated users, return a default learning path
    if (userId.startsWith('simulated-user')) {
      console.log('Returning default learning path for simulated user');
      return getDefaultLearningPath();
    }
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Default learning path for simulated users
function getDefaultLearningPath() {
  return {
    path_title: "Digital Skills for Professional Growth",
    path_description: "A comprehensive learning journey designed to build essential digital skills for remote work and professional development.",
    milestones: [
      {
        title: "Digital Literacy Fundamentals",
        description: "Master the basics of computing, internet, and file management.",
        skills: ["Computer Navigation", "Internet Browsing", "File Management", "Basic Troubleshooting"],
        timeframe: "3 weeks",
        project: "Create a digital organization system for personal documents"
      },
      {
        title: "Office Productivity Suite",
        description: "Learn to use word processing, spreadsheets, and presentation software effectively.",
        skills: ["Word Processing", "Spreadsheet Calculations", "Creating Presentations", "Document Formatting"],
        timeframe: "4 weeks",
        project: "Develop a professional resume and budget tracker"
      },
      {
        title: "Professional Communication",
        description: "Develop skills for effective digital communication in a professional setting.",
        skills: ["Email Etiquette", "Virtual Meeting Skills", "Collaborative Tools", "Written Communication"],
        timeframe: "3 weeks",
        project: "Conduct a virtual team meeting and create a team newsletter"
      },
      {
        title: "Data Entry and Management",
        description: "Learn accurate data entry, organization, and basic analysis.",
        skills: ["Fast and Accurate Typing", "Data Validation", "Database Basics", "Data Organization"],
        timeframe: "3 weeks",
        project: "Create and manage a customer database with reporting"
      }
    ],
    career_opportunities: [
      {
        title: "Virtual Assistant",
        description: "Provide remote administrative support to businesses and entrepreneurs."
      },
      {
        title: "Data Entry Specialist",
        description: "Work with companies to ensure accurate data input and management."
      },
      {
        title: "Customer Support Representative",
        description: "Assist customers remotely through email, chat, or phone support."
      }
    ]
  };
}

// Helper function to save learning path for a user
function saveLearningPath(userId: string, pathData: any) {
  try {
    const filePath = path.join(PATHS_DIR, `${userId}.json`);
    console.log(`Saving learning path for user ${userId} to ${filePath}`);
    console.log('Path data:', JSON.stringify(pathData, null, 2));
    
    fs.writeFileSync(filePath, JSON.stringify(pathData, null, 2), 'utf-8');
    console.log('Learning path saved successfully');
    
    return pathData;
  } catch (error) {
    console.error('Error in saveLearningPath:', error);
    throw error;
  }
}

// Get learning path for a user
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const learningPath = getLearningPath(userId);
    
    if (!learningPath) {
      return NextResponse.json(
        { error: 'Learning path not found for this user' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ path: learningPath });
  } catch (error) {
    console.error('Error retrieving learning path:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve learning path', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Save or update learning path for a user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received POST request with body:', body);
    
    const { userId, path } = body;
    
    if (!userId) {
      console.error('Missing userId in request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!path) {
      console.error('Missing path data in request');
      return NextResponse.json(
        { error: 'Path data is required' },
        { status: 400 }
      );
    }
    
    // Validate path data structure
    if (!path.path_title || !path.path_description || !Array.isArray(path.milestones) || !Array.isArray(path.career_opportunities)) {
      console.error('Invalid path data structure:', path);
      return NextResponse.json(
        { error: 'Invalid path data structure. Required fields: path_title, path_description, milestones (array), career_opportunities (array)' },
        { status: 400 }
      );
    }
    
    const savedPath = saveLearningPath(userId, path);
    return NextResponse.json({ path: savedPath });
  } catch (error) {
    console.error('Error saving learning path:', error);
    return NextResponse.json(
      { error: 'Failed to save learning path', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Delete learning path for a user
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const filePath = path.join(PATHS_DIR, `${userId}.json`);
    
    if (!fs.existsSync(filePath)) {
      // Instead of an error, return success since the goal is achieved (no file exists)
      return NextResponse.json({ 
        message: 'No learning path found for this user. Nothing to delete.' 
      });
    }
    
    fs.unlinkSync(filePath);
    return NextResponse.json({ message: 'Learning path deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning path:', error);
    return NextResponse.json(
      { error: 'Failed to delete learning path', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 