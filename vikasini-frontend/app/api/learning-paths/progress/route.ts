import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory to store learning paths progress
const DATA_DIR = path.join(process.cwd(), 'data');
const PROGRESS_DIR = path.join(DATA_DIR, 'learning-progress');

// Create directories if they don't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
  console.log(`Created data directory at ${DATA_DIR}`);
}
if (!fs.existsSync(PROGRESS_DIR)) {
  fs.mkdirSync(PROGRESS_DIR);
  console.log(`Created learning progress directory at ${PROGRESS_DIR}`);
}

// Helper function to read user progress
function getUserProgress(userId: string) {
  const filePath = path.join(PROGRESS_DIR, `${userId}.json`);
  
  if (!fs.existsSync(filePath)) {
    // Default progress for new users
    return { currentMilestone: 0, lastUpdated: new Date().toISOString() };
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Helper function to save user progress
function saveUserProgress(userId: string, progressData: any) {
  try {
    const filePath = path.join(PROGRESS_DIR, `${userId}.json`);
    console.log(`Saving learning progress for user ${userId} to ${filePath}`);
    
    // Add timestamp
    const dataToSave = {
      ...progressData,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Progress data:', JSON.stringify(dataToSave, null, 2));
    
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    console.log('Learning progress saved successfully');
    
    return dataToSave;
  } catch (error) {
    console.error('Error in saveUserProgress:', error);
    throw error;
  }
}

// Get learning progress for a user
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
    const progress = getUserProgress(userId);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error retrieving learning progress:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve learning progress', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Save learning progress for a user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received POST request with body:', body);
    
    const { userId, currentMilestone } = body;
    
    if (!userId) {
      console.error('Missing userId in request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (currentMilestone === undefined) {
      console.error('Missing currentMilestone in request');
      return NextResponse.json(
        { error: 'Current milestone is required' },
        { status: 400 }
      );
    }
    
    // Validate milestone is a non-negative integer
    if (!Number.isInteger(currentMilestone) || currentMilestone < 0) {
      console.error('Invalid milestone value:', currentMilestone);
      return NextResponse.json(
        { error: 'Current milestone must be a non-negative integer' },
        { status: 400 }
      );
    }
    
    const savedProgress = saveUserProgress(userId, { currentMilestone });
    return NextResponse.json({ progress: savedProgress });
  } catch (error) {
    console.error('Error saving learning progress:', error);
    return NextResponse.json(
      { error: 'Failed to save learning progress', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 