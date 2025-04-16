import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with API key from environment variable
// Fallback to the hardcoded key only for development (not recommended for production)
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCzFB6STSd116yARH16eoWk-Ar1EyanUlw';
const genAI = new GoogleGenerativeAI(API_KEY);

// Enhanced JSON parsing function with better error handling
function safeJsonParse(jsonString: string) {
  try {
    // First try direct parsing
    return JSON.parse(jsonString);
  } catch (error) {
    console.log('Direct JSON parsing failed, trying to extract JSON from text...');
    
    try {
      // Look for JSON in code blocks (markdown format)
      const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/) || 
                        jsonString.match(/```\n([\s\S]*?)\n```/);
      
      if (jsonMatch && jsonMatch[1]) {
        console.log('Found JSON in code block, attempting to parse...');
        return JSON.parse(jsonMatch[1]);
      }
      
      // If no code blocks, try to find JSON object directly in the text
      const possibleJson = jsonString.match(/(\{[\s\S]*\})/);
      if (possibleJson && possibleJson[1]) {
        console.log('Found possible JSON object, attempting to parse...');
        return JSON.parse(possibleJson[1]);
      }
      
      throw new Error('Could not extract valid JSON from the response');
    } catch (extractError: unknown) {
      console.error('Failed to extract and parse JSON:', extractError);
      if (extractError instanceof Error) {
        throw new Error(`Invalid JSON format: ${extractError.message}`);
      } else {
        throw new Error('Invalid JSON format: Unknown error during extraction');
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received request to generate learning path');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { interests, name, preferredLanguage, userId, uniqueGenerationId, timestamp } = body;

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      console.error('Invalid interests array:', interests);
      return NextResponse.json(
        { error: 'Interests array is required' },
        { status: 400 }
      );
    }

    // Ensure name is provided
    const userName = name || 'Learner';
    
    // Map interest IDs to their full names
    const interestLabels = interests.map(interest => {
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
    
    console.log('Mapped interests:', interestLabels);
    console.log('Generating path for user ID:', userId || 'unknown');

    // Create a simplified prompt for Gemini - focusing on essential requirements
    const prompt = `
    You are a career development AI mentor for women learning digital skills in India. 
    Create a UNIQUE and personalized learning path for ${userName} who has indicated interest in: ${interestLabels.join(', ')}.
    
    KEY REQUIREMENTS:
    1. Create EXACTLY 2 course milestones for EACH interest area listed above (${interestLabels.length * 2} total milestones)
    2. Personalize everything for ${userName} specifically
    3. Each milestone must have a clearly marked "interest_area" field that matches one of: ${interestLabels.join(', ')}
    4. For each interest area, create one "Beginner" and one "Advanced" level course
    
    Each milestone must include:
    - "title": Clear course title indicating the interest area
    - "description": Brief course description
    - "interest_area": MUST be exactly one of these values: ${interestLabels.join(', ')}
    - "level": "Beginner" or "Advanced"
    - "skills": Array of 3-4 specific skills
    - "timeframe": Duration in weeks
    - "project": A practical assignment
    
    End with 2-3 career opportunities relevant to the learned skills.
    
    CRITICAL: Response must be valid JSON with this exact structure:
    {
      "path_title": "Title including ${userName}'s name",
      "path_description": "Personalized description",
      "milestones": [
        {
          "title": "Course title",
          "description": "Course description",
          "interest_area": "One of: ${interestLabels.join(', ')}",
          "level": "Beginner or Advanced",
          "skills": ["Skill 1", "Skill 2", "Skill 3"],
          "timeframe": "X weeks",
          "project": "Project description"
        }
      ],
      "career_opportunities": [
        {
          "title": "Job title",
          "description": "Career description"
        }
      ]
    }
    
    Remember: Return ONLY valid JSON with EXACTLY ${interestLabels.length * 2} milestones total (2 per interest area).
    `;
    
    console.log('Calling Gemini API with learning path generation prompt');

    // Call Gemini API
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      // Configuration parameters for generation
      const generationConfig = {
        temperature: 0.8, // Slightly lower temperature for more consistent structure
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      };
      
      // Safety settings
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ];
      
      console.log('Gemini API call with config:', { 
        model: 'gemini-1.5-pro',
        promptLength: prompt.length,
        generationConfig
      });
      
      // Extended timeout to 60 seconds for more complex generation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Gemini API request timed out after 60 seconds')), 60000);
      });
      
      // Race the API call against the timeout
      const resultPromise = model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings
      });
      
      // Wait for response with extended timeout
      const result = await Promise.race([resultPromise, timeoutPromise]) as any;
      const response = await result.response;
      const text = response.text();
      
      console.log('Received response from Gemini API');
      console.log('Response length:', text.length);
      console.log('First 100 characters:', text.substring(0, 100));

      // Parse and validate the response
      let pathData;
      try {
        // Use enhanced JSON parsing
        pathData = safeJsonParse(text);
        
        // Validate basic structure
        if (!pathData.path_title || !pathData.path_description || 
            !Array.isArray(pathData.milestones) || !Array.isArray(pathData.career_opportunities)) {
          throw new Error('Generated path has invalid structure');
        }
        
        // Check user name is included
        if (!pathData.path_title.includes(userName)) {
          console.warn(`Path title doesn't include user name "${userName}". Fixing...`);
          pathData.path_title = `${userName}'s ${pathData.path_title}`;
        }
        
        // Fix and validate milestones
        const expectedMilestoneCount = interestLabels.length * 2;
        
        // Track milestones per interest area
        const interestAreaCount: Record<string, number> = {};
        const interestLevelCount: Record<string, Record<string, number>> = {};
        
        // Initialize counters for each interest area
        interestLabels.forEach(interest => {
          interestAreaCount[interest] = 0;
          interestLevelCount[interest] = { 'Beginner': 0, 'Advanced': 0 };
        });
        
        // Process milestones and fix any issues
        pathData.milestones.forEach((milestone: any, index: number) => {
          // Check for missing properties
          if (!milestone.title || !milestone.description || !Array.isArray(milestone.skills) || 
              !milestone.timeframe || !milestone.project) {
            console.warn(`Milestone ${index} missing properties - fixing...`);
            
            milestone.title = milestone.title || `Course ${index + 1}`;
            milestone.description = milestone.description || "Course focused on building essential skills";
            milestone.skills = Array.isArray(milestone.skills) ? milestone.skills : ["Skill 1", "Skill 2", "Skill 3"];
            milestone.timeframe = milestone.timeframe || "3 weeks";
            milestone.project = milestone.project || "Practical project to demonstrate skills";
          }
          
          // Validate and fix interest_area
          if (!milestone.interest_area || !interestLabels.includes(milestone.interest_area)) {
            // Try to infer interest area from title or description
            let inferredInterest = null;
            
            for (const interest of interestLabels) {
              if (milestone.title.toLowerCase().includes(interest.toLowerCase()) ||
                  milestone.description.toLowerCase().includes(interest.toLowerCase())) {
                inferredInterest = interest;
                break;
              }
            }
            
            // If we couldn't infer, assign one with fewest milestones
            if (!inferredInterest) {
              // Find interest areas with fewest milestones
              const minCount = Math.min(...Object.values(interestAreaCount));
              const candidateInterests = interestLabels.filter(interest => 
                interestAreaCount[interest] === minCount
              );
              
              inferredInterest = candidateInterests[0];
            }
            
            console.warn(`Milestone ${index} has invalid interest_area, setting to: ${inferredInterest}`);
            milestone.interest_area = inferredInterest;
          }
          
          // Validate and fix level
          if (!milestone.level || (milestone.level !== "Beginner" && milestone.level !== "Advanced")) {
            // Determine level based on existing count
            const begCount = interestLevelCount[milestone.interest_area].Beginner;
            const advCount = interestLevelCount[milestone.interest_area].Advanced;
            
            if (begCount <= advCount) {
              milestone.level = "Beginner";
            } else {
              milestone.level = "Advanced";
            }
            
            console.warn(`Milestone ${index} has invalid level, setting to: ${milestone.level}`);
          }
          
          // Update counts
          interestAreaCount[milestone.interest_area]++;
          interestLevelCount[milestone.interest_area][milestone.level]++;
        });
        
        // Check for milestone count and distribution issues
        const actualMilestoneCount = pathData.milestones.length;
        let distributionIssue = false;
        
        console.log("Interest area milestone distribution:", interestAreaCount);
        console.log("Interest area level distribution:", interestLevelCount);
        
        // Fix distribution issues
        if (actualMilestoneCount !== expectedMilestoneCount) {
          console.warn(`Milestone count mismatch: expected ${expectedMilestoneCount}, got ${actualMilestoneCount}`);
          
          if (actualMilestoneCount > expectedMilestoneCount) {
            // Too many milestones - trim extras
            console.log("Trimming extra milestones");
            pathData.milestones = pathData.milestones.slice(0, expectedMilestoneCount);
          } else {
            // Too few milestones - add placeholders for missing ones
            console.log("Adding placeholder milestones for missing ones");
            
            const missingMilestones = [];
            
            // Identify which interest areas need more milestones
            for (const interest of interestLabels) {
              const currentCount = interestAreaCount[interest] || 0;
              if (currentCount < 2) {
                const neededCount = 2 - currentCount;
                
                for (let i = 0; i < neededCount; i++) {
                  // Determine level
                  let level;
                  if (!interestLevelCount[interest]?.Beginner) {
                    level = "Beginner";
                  } else if (!interestLevelCount[interest]?.Advanced) {
                    level = "Advanced";
                  } else {
                    level = "Beginner"; // Default
                  }
                  
                  missingMilestones.push({
                    title: `${interest} ${level} Course`,
                    description: `Essential skills in ${interest}`,
                    interest_area: interest,
                    level: level,
                    skills: ["Skill 1", "Skill 2", "Skill 3"],
                    timeframe: "3 weeks",
                    project: `Practical project in ${interest}`
                  });
                }
              }
            }
            
            // Add the missing milestones
            pathData.milestones = [...pathData.milestones, ...missingMilestones];
          }
        }
        
        // Check for proper distribution
        for (const interest of interestLabels) {
          if ((interestAreaCount[interest] || 0) !== 2) {
            distributionIssue = true;
            console.warn(`Interest area "${interest}" has ${interestAreaCount[interest] || 0} milestones, should have 2`);
          }
        }
        
        // Final validation - log major issues but still return what we have
        if (distributionIssue) {
          console.warn("Interest area distribution issues remain after fixing attempts");
        }
        
        console.log('Finished processing and validating learning path');
      } catch (error) {
        console.error('Failed to parse or validate Gemini response:', error);
        console.error('Raw text from Gemini:', text);
        
        // Create a fallback learning path
        return NextResponse.json(
          { 
            path: generateFallbackLearningPath(userName, interestLabels),
            warning: "Used fallback path due to generation error",
            error: error instanceof Error ? error.message : String(error)
          }
        );
      }

      return NextResponse.json({ path: pathData });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Return fallback path instead of error
      return NextResponse.json({ 
        path: generateFallbackLearningPath(userName, interestLabels),
        warning: "Used fallback path due to Gemini API error",
        error: geminiError instanceof Error ? geminiError.message : String(geminiError)
      });
    }
  } catch (error) {
    console.error('Learning path generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning path', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Fallback learning path generator when API fails
function generateFallbackLearningPath(userName: string, interestLabels: string[]) {
  const milestones = [];
  
  // Create 2 milestones for each interest
  for (const interest of interestLabels) {
    milestones.push({
      title: `${interest} Fundamentals`,
      description: `Learn the essential basics of ${interest} to build a solid foundation.`,
      interest_area: interest,
      level: "Beginner",
      skills: ["Basic concepts", "Fundamental tools", "Essential practices", "Core principles"],
      timeframe: "3 weeks",
      project: `Create a basic ${interest} portfolio piece to demonstrate your skills`
    });
    
    milestones.push({
      title: `Advanced ${interest}`,
      description: `Build on your ${interest} knowledge with advanced techniques and practical applications.`,
      interest_area: interest,
      level: "Advanced",
      skills: ["Advanced techniques", "Professional tools", "Real-world applications", "Problem-solving"],
      timeframe: "4 weeks",
      project: `Develop a comprehensive ${interest} project that showcases your advanced capabilities`
    });
  }
  
  return {
    path_title: `${userName}'s Digital Skills Development Path`,
    path_description: `A personalized learning journey for ${userName} focusing on ${interestLabels.join(', ')} to build professional skills for remote work opportunities.`,
    milestones: milestones,
    career_opportunities: [
      {
        title: "Remote Data Entry Professional",
        description: "Work with organizations to manage and process data remotely."
      },
      {
        title: "Digital Assistant",
        description: "Provide administrative and technical support for businesses online."
      },
      {
        title: "Content Creator",
        description: "Create digital content for websites, social media, and other platforms."
      }
    ]
  };
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to generate learning paths' },
    { status: 405 }
  );
} 