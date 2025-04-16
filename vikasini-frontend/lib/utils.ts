import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a relevant Unsplash image URL based on topic
 * @param topic The topic/keyword for the image (defaults to a general topic if none provided)
 * @param width Image width in pixels
 * @param height Image height in pixels
 * @returns Unsplash image URL
 */
export function getUnsplashImage(topic?: string, width: number = 600, height: number = 400): string {
  // Specific topic-to-image mappings for common course topics to ensure reliability
  const topicImageMap: Record<string, string> = {
    // Course topics
    "customer service": "1573497019940-1c28c88b4f3e",
    "excel": "1522071820081-009f0129c71c",
    "spreadsheet": "1522071820081-009f0129c71c",
    "virtual assistant": "1531482615713-2afd69097998",
    "social media": "1611162617213-7d7a39e9b1d7",
    "communication": "1573496546620-c44559c46908",
    "digital literacy": "1611432579699-484f7990b127",
    "data entry": "1551288049-bebda4e38f71",
    "business english": "1517245386807-bb43f82c33c4",
    "content writing": "1533750349088-cd871a92f312",
    
    // People categories
    "woman professional": "1573496546620-c44559c46908", 
    "indian woman": "1573497491765-55a96c2e9c6c",
    "teacher": "1517960413843-0aee8e2b3285",
    "student": "1523580494863-6f3031224c94",
    "profile": "1494790108377-be9c29b29330",
    
    // General categories
    "education": "1509062522246-3755977927d7",
    "learning": "1509062522246-3755977927d7",
    "office": "1503676260728-1c00da094a0b",
    "course": "1488190211105-8b0e65b80b4e",
  };

  // Collection of verified Unsplash photo IDs that work with Next.js Image component
  const reliableUnsplashPhotoIds = [
    "1488190211105-8b0e65b80b4e", // education, books
    "1509062522246-3755977927d7", // education
    "1517245386807-bb43f82c33c4", // classroom
    "1503676260728-1c00da094a0b", // office
    "1541178735493-479c2a5a9179", // people learning
    "1522202176005-7a5a6f3a1e39", // person typing
    "1531482615713-2afd69097998", // meeting
    "1573496546620-c44559c46908", // woman professional
    "1573497491765-55a96c2e9c6c", // woman professional
    "1573497019940-1c28c88b4f3e", // woman professional
    "1611432579699-484f7990b127", // digital literacy
    "1551288049-bebda4e38f71", // computer skills
    "1448932223592-d1fc686e76ea", // office skills
    "1618044733739-2a8b30a41512", // speaking
    "1533750349088-cd871a92f312", // writing
    "1522071820081-009f0129c71c", // data analytics
    "1551836022-b06985bceb24", // online learning
    "1517960413843-0aee8e2b3285", // teacher
    "1523580494863-6f3031224c94", // study
  ];

  // Check if we have an exact match in our topic map
  let photoId: string | undefined;
  
  if (topic) {
    const lowerTopic = topic.toLowerCase();
    
    // Check for exact matches in the topic map
    for (const [key, id] of Object.entries(topicImageMap)) {
      if (lowerTopic.includes(key)) {
        photoId = id;
        break;
      }
    }
  }
  
  // If no direct match, use our hashing algorithm
  if (!photoId) {
    // Get a deterministic but "random" photo ID based on the topic
    let photoIdIndex = 0;
    if (topic) {
      // Simple hash to get a deterministic index based on the topic
      const topicHash = topic.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      photoIdIndex = topicHash % reliableUnsplashPhotoIds.length;
    }
    
    photoId = reliableUnsplashPhotoIds[photoIdIndex];
  }
  
  // Return the full URL
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&crop=entropy`;
}

/**
 * Replace a placeholder image with a relevant Unsplash image
 * This function takes a placeholder URL and extracts dimensions to create an Unsplash image
 * @param placeholderUrl The original placeholder URL (e.g., "/placeholder.svg?height=400&width=400")
 * @param topic Optional topic for the Unsplash image
 * @returns Unsplash image URL with appropriate dimensions
 */
export function replacePlaceholderWithUnsplash(placeholderUrl: string, topic?: string): string {
  // Default dimensions
  let width = 600;
  let height = 400;
  
  // Extract dimensions from placeholder URL if they exist
  if (placeholderUrl.includes('?')) {
    const params = new URLSearchParams(placeholderUrl.split('?')[1]);
    const widthParam = params.get('width');
    const heightParam = params.get('height');
    
    if (widthParam) width = parseInt(widthParam, 10);
    if (heightParam) height = parseInt(heightParam, 10);
  }
  
  // Use text parameter as topic if it exists
  if (placeholderUrl.includes('text=')) {
    const match = placeholderUrl.match(/text=([^&]+)/);
    if (match && match[1] && !topic) {
      topic = match[1];
    }
  }
  
  return getUnsplashImage(topic, width, height);
}

/**
 * Generates a PDF resume for the user based on their skills and interests
 * @param user User data including name, skills, interests, etc.
 */
export const generateResumeForDownload = (user: any) => {
  // Create a styled HTML resume
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #FF5722;
            margin-bottom: 5px;
          }
          .header p {
            margin-top: 0;
            color: #666;
          }
          .section {
            margin-bottom: 25px;
          }
          .section h2 {
            border-bottom: 2px solid #FF5722;
            padding-bottom: 5px;
            color: #333;
          }
          .skills-container {
            display: flex;
            flex-wrap: wrap;
          }
          .skill {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 5px 12px;
            margin: 5px;
          }
          .progress-container {
            height: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
            margin-top: 5px;
          }
          .progress-bar {
            height: 100%;
            border-radius: 5px;
            background-color: #FF5722;
          }
          .contact-info {
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${user.name}</h1>
          <p>${user.email || 'No email provided'}</p>
          <div class="contact-info">
            <p>Language Preference: ${user.preferredLanguage || 'English'}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Skills</h2>
          <div class="skills-container">
            ${user.skills?.map((skill: any) => `
              <div>
                <div class="skill">${skill.name}</div>
                <div class="progress-container">
                  <div class="progress-bar" style="width: ${skill.level}%"></div>
                </div>
              </div>
            `).join('') || 'No skills listed'}
          </div>
        </div>
        
        <div class="section">
          <h2>Interests</h2>
          <div class="skills-container">
            ${user.interests?.map((interest: string) => `
              <div class="skill">${interest.replace('_', ' ')}</div>
            `).join('') || 'No interests listed'}
          </div>
        </div>
        
        <div class="section">
          <h2>Completed Courses</h2>
          <ul>
            ${user.completedCourses?.map((course: any) => `
              <li>${typeof course === 'object' ? course.title || 'Unnamed Course' : 'Course ' + course}</li>
            `).join('') || 'No courses completed yet'}
          </ul>
        </div>
        
        <div class="section">
          <h2>Experience</h2>
          <p>Experience points: ${user.xpPoints || 0}</p>
        </div>
      </body>
    </html>
  `;
  
  // Create a blob with the HTML content
  const blob = new Blob([html], { type: 'text/html' });
  
  // Create an object URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Open a new window with the resume
  const newWindow = window.open(url, '_blank');
  
  // Trigger print dialog when the page loads
  if (newWindow) {
    newWindow.onload = () => {
      newWindow.print();
    };
  }
  
  // Clean up the object URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};
