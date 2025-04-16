"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Send, Volume2, VolumeX, Headphones, BookOpen, Briefcase, Lightbulb } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/LanguageContext"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getUnsplashImage } from "@/lib/utils"

// Types for conversation messages
type MessageBase = {
  id: number;
  sender: "user" | "ai";
  message: string;
  timestamp: string;
};

type UserMessage = MessageBase & {
  sender: "user";
};

type AIMessage = MessageBase & {
  sender: "ai";
  emotion: "helpful" | "empathy" | "encouraging";
};

type Message = UserMessage | AIMessage;

// Mock AI responses for when API is unavailable
const mockResponses = {
  "typing speed": "To improve your typing speed for data entry, try daily practice with typing games or software like TypingClub. Focus on accuracy first, use all fingers, and gradually increase your speed with consistent practice.",

  "job interview": "It's normal to feel nervous before interviews. Prepare by researching the company, rehearsing common questions, and staying calm. Practice mock interviews with friends or your mentor for confidence.",

  "excel": "VLOOKUP helps you find data in large tables. Use the formula =VLOOKUP(lookup_value, table_range, column_index, match_type). Practice with sample sheets to get better.",

  "email": "For a job application email, use a clear subject, greet formally, explain why you're writing, highlight key skills, and mention your attached resume. Keep it brief and check grammar.",

  "resume": "Create a one-page resume with your education, skills, projects, and achievements. Tailor it for each job and use strong action words like 'Led', 'Created', or 'Implemented'.",

  "confidence": "Confidence is built over time. Start with small achievements, practice speaking aloud, dress well, and reflect on your progress weekly. Stay kind to yourself.",

  "freelancing": "To begin freelancing, identify your skills, create a profile on Upwork or Fiverr, showcase previous work, and start with small projects. Deliver on time and build your ratings.",

  "computer basics": "Learning computer basics means knowing how to use a keyboard, mouse, operating systems, browsers, and email. Practice navigating folders, using search, and installing apps.",

  "soft skills": "Soft skills include communication, empathy, leadership, and adaptability. These help you collaborate better and grow professionally in any field.",

  "data entry": "For data entry jobs, improve accuracy, typing speed, and familiarity with Excel or Google Sheets. Always double-check entries and stay organized.",

  "english speaking": "To improve English speaking, speak daily in front of a mirror, join a speaking group, watch English shows, and use simple sentences at first.",

  "time management": "Use time-blocking, daily to-do lists, and reminders. Prioritize your most important tasks and break large tasks into small, manageable chunks.",

  "online jobs": "Explore jobs like transcription, tutoring, graphic design, and virtual assistance. Sites like Freelancer, LinkedIn, and Internshala offer legit opportunities.",

  "motivation": "Stay motivated by setting small goals, rewarding yourself, tracking your growth, and surrounding yourself with supportive people. Remember your 'why'.",

  "career change": "Explore your new interest, learn the basics via free courses, talk to people in the field, and start small with internships or freelancing in that domain.",

  "mental health": "Mental well-being is key to success. If you're feeling overwhelmed, talk to someone, take breaks, and practice self-care like journaling or meditation.",

  "emotions": "It's okay to feel sad, anxious, or confused. Label your emotions, talk to someone you trust, and try grounding techniques like deep breathing.",

  "internships": "Apply early, tailor your resume, and include your projects and certifications. Follow up on applications and be open to learning roles, even unpaid ones.",

  "leadership": "Leadership is not about position, but influence. Listen to your team, communicate clearly, take responsibility, and support others in their growth.",

  "entrepreneurship": "Starting a business needs passion, problem-solving, and persistence. Begin by identifying a problem, building a simple solution, and testing it with real users.",

  "parenting support": "Balancing learning or work with parenting is tough. Make a routine, involve your child where possible, and don't be too hard on yourself. Progress matters.",

  "online safety": "Never share your passwords or personal information online. Use strong passwords, avoid clicking unknown links, and report suspicious behavior.",

  "social media": "Use social media to learn, connect, and grow your personal brand. Avoid distractions by setting time limits and following positive, inspiring accounts.",

  "digital payment": "UPI apps like Google Pay or PhonePe are safe if you never share your OTP or PIN. Always verify payment requests and check balances regularly.",

  "spoken Hindi to English": "Translate slowly in your head from Hindi to English. Use simple sentences. For example, 'Main theek hoon' becomes 'I am fine'. Practice every day.",

  "public speaking": "Start by practicing in front of a mirror, then to friends. Use hand gestures, make eye contact, and pause to think. Be clear and concise.",

  "coding": "Start coding by learning basics of HTML, CSS, JavaScript or Python. Practice small projects like a calculator, portfolio website, or to-do list app.",

  "employability": "Being employable means having job-ready skills like communication, basic computer knowledge, and a willingness to learn. Keep upskilling regularly.",

  "women empowerment": "Empowered women support each other. Upskilling, financial literacy, emotional strength, and decision-making are all part of becoming independent.",

  "finance": "Start budgeting monthly expenses, use a simple Excel sheet or mobile app, avoid unnecessary spending, and save a little each month.",

  "default": "I understand you're looking for guidance on this topic. Based on your progress in the Digital Literacy and Data Entry courses, I'd suggest breaking this down into smaller steps. What specific part are you finding challenging? I'm here to help you work through it step-by-step."
};

// Get best matching mock response based on keywords
function getBestMockResponse(query: string): string {
  query = query.toLowerCase();

  if (query.includes("typing") || query.includes("speed") || query.includes("type faster"))
    return mockResponses["typing speed"];
  if (query.includes("interview") || query.includes("nervous") || query.includes("job interview"))
    return mockResponses["job interview"];
  if (query.includes("excel") || query.includes("vlookup") || query.includes("spreadsheet"))
    return mockResponses["excel"];
  if (query.includes("email") || query.includes("application") || query.includes("cover letter"))
    return mockResponses["email"];
  if (query.includes("resume") || query.includes("cv") || query.includes("biodata"))
    return mockResponses["resume"];
  if (query.includes("confidence") || query.includes("shy") || query.includes("hesitate"))
    return mockResponses["confidence"];
  if (query.includes("freelance") || query.includes("gig") || query.includes("remote job"))
    return mockResponses["freelancing"];
  if (query.includes("computer") || query.includes("basics") || query.includes("digital literacy"))
    return mockResponses["computer basics"];
  if (query.includes("soft skill") || query.includes("communication") || query.includes("teamwork"))
    return mockResponses["soft skills"];
  if (query.includes("data entry") || query.includes("data job"))
    return mockResponses["data entry"];
  if (query.includes("english") || query.includes("spoken") || query.includes("speak english"))
    return mockResponses["english speaking"];
  if (query.includes("time") || query.includes("manage time") || query.includes("productivity"))
    return mockResponses["time management"];
  if (query.includes("online job") || query.includes("remote") || query.includes("work from home"))
    return mockResponses["online jobs"];
  if (query.includes("motivation") || query.includes("demotivated") || query.includes("lost hope"))
    return mockResponses["motivation"];
  if (query.includes("career change") || query.includes("switch career") || query.includes("new job field"))
    return mockResponses["career change"];
  if (query.includes("mental") || query.includes("depression") || query.includes("anxiety"))
    return mockResponses["mental health"];
  if (query.includes("emotion") || query.includes("feeling") || query.includes("sad"))
    return mockResponses["emotions"];
  if (query.includes("intern") || query.includes("internship") || query.includes("trainee"))
    return mockResponses["internships"];
  if (query.includes("leadership") || query.includes("team lead") || query.includes("leader"))
    return mockResponses["leadership"];
  if (query.includes("business") || query.includes("entrepreneur") || query.includes("startup"))
    return mockResponses["entrepreneurship"];
  if (query.includes("parent") || query.includes("mother") || query.includes("child"))
    return mockResponses["parenting support"];
  if (query.includes("safety") || query.includes("secure") || query.includes("cyber"))
    return mockResponses["online safety"];
  if (query.includes("social media") || query.includes("facebook") || query.includes("instagram"))
    return mockResponses["social media"];
  if (query.includes("payment") || query.includes("upi") || query.includes("digital money"))
    return mockResponses["digital payment"];
  if (query.includes("hindi to english") || query.includes("translate") || query.includes("hinglish"))
    return mockResponses["spoken Hindi to English"];
  if (query.includes("public speaking") || query.includes("speech") || query.includes("stage fear"))
    return mockResponses["public speaking"];
  if (query.includes("code") || query.includes("programming") || query.includes("html") || query.includes("python"))
    return mockResponses["coding"];
  if (query.includes("employability") || query.includes("hire") || query.includes("job ready"))
    return mockResponses["employability"];
  if (query.includes("women") || query.includes("empower") || query.includes("female"))
    return mockResponses["women empowerment"];
  if (query.includes("finance") || query.includes("budget") || query.includes("money management"))
    return mockResponses["finance"];

  return mockResponses["default"];
}


export default function MentorPage() {
  // Add client-side only rendering state
  const [isClient, setIsClient] = useState(false);
  
  // Original state variables
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [ollamaAvailable, setOllamaAvailable] = useState(false)
  const [lastResponseFromOllama, setLastResponseFromOllama] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Audio recording state
  const [audioData, setAudioData] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Fresh chat with just a welcome message
  const [conversations, setConversations] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      message: t('mentor.welcome') || "Hello! I'm your Vikasini AI mentor. How can I help you with your learning journey today?",
      timestamp: "Just now",
      emotion: "helpful",
    }
  ])

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check API availability on component mount
  useEffect(() => {
    if (!isClient) return;
    
    async function checkApiStatus() {
      try {
        const response = await fetch("/api/mentor/status");
        if (response.ok) {
          const data = await response.json();
          setApiAvailable(data.status === 'ok');
          setOllamaAvailable(data.ollama?.available || false);
        } else {
          setApiAvailable(false);
          setOllamaAvailable(false);
        }
      } catch (error) {
        console.error("API check failed:", error);
        setApiAvailable(false);
        setOllamaAvailable(false);
      }
    }
    
    checkApiStatus();
  }, [isClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isClient) {
      scrollToBottom();
    }
  }, [conversations, isClient]);

  async function getAIResponse(userMessage: string, conversationHistory: string): Promise<string> {
    try {
      // Format conversation history for the API
      const formattedHistory = conversations
        .map(msg => `${msg.sender === 'ai' ? 'Assistant' : 'User'}: ${msg.message}`)
        .join('\n');
      
      // User profile data
      const userProfile = {
        name: "Priya",
        level: "Beginner",
        courses: ["Digital Literacy Fundamentals", "Basic Data Entry Skills"],
        progress: 68,
        skills: ["basic computer", "typing", "beginner excel"]
      };
      
      // Call our internal API
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          language: language,
          isVoice: false, // We're using text input here
          isMuted: isMuted,
          conversationHistory: formattedHistory,
          userProfile: userProfile
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // If audio URL is available and not muted, play it
      if (result.audioUrl && !isMuted) {
        new Audio(result.audioUrl).play();
      }
      
      return result.response || getBestMockResponse(userMessage);
    } catch (error) {
      console.error("Error in API call:", error);
      return getBestMockResponse(userMessage);
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message
    const newUserMessage: UserMessage = {
      id: conversations.length + 1,
      sender: "user",
      message: message,
      timestamp: "Just now",
    }

    setConversations([...conversations, newUserMessage])
    setMessage("")
    setIsLoading(true)

    try {
      // Format conversation history
      const conversationHistory = conversations
        .map(msg => `${msg.sender === 'ai' ? 'Assistant' : 'User'}: ${msg.message}`)
        .join('\n');
      
      // User profile data
      const userProfile = {
        name: "Priya",
        level: "Beginner",
        courses: ["Digital Literacy Fundamentals", "Basic Data Entry Skills"],
        progress: 68,
        skills: ["basic computer", "typing", "beginner excel"]
      };
      
      console.log("Sending request to API with message:", newUserMessage.message);
      
      // Call our API endpoint
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newUserMessage.message,
          language: language,
          isVoice: false,
          isMuted: isMuted,
          conversationHistory: conversationHistory,
          userProfile: userProfile
        })
      });

      console.log("API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response data:", result);
      
      // Get response text
      const responseText = result.response;
      
      // Track if response came from Ollama
      setLastResponseFromOllama(result.fromOllama || false);
      
      // Determine response emotion
      let emotion: AIMessage["emotion"] = determineEmotion(responseText);

      // Add AI response
      const aiMessage: AIMessage = {
        id: conversations.length + 2,
        sender: "ai",
        message: responseText,
        timestamp: "Just now",
        emotion: emotion,
      };

      setConversations(prevConversations => [...prevConversations, aiMessage]);
      
      // If audio URL is available and not muted, play it
      if (result.audioUrl && !isMuted) {
        const audio = new Audio(result.audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Fallback response in case of any other errors
      const fallbackMessage: AIMessage = {
        id: conversations.length + 2,
        sender: "ai",
        message: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Could you please try again in a moment?",
        timestamp: "Just now",
        emotion: "helpful",
      };
      
      setConversations(prevConversations => [...prevConversations, fallbackMessage]);
      setLastResponseFromOllama(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      stopRecording();
    } else {
      // Start recording after requesting permissions
      requestMicrophonePermission();
    }
  }

  // Function to request microphone permission explicitly
  const requestMicrophonePermission = async () => {
    try {
      // Show permission request dialog to the user
      toast({
        title: "Microphone access",
        description: "Please allow microphone access when prompted",
        duration: 3000,
      });
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If we get here, permission was granted
      toast({
        title: "Permission granted",
        description: "Starting voice recording...",
        duration: 2000,
      });
      
      // Start recording with the obtained stream
      setIsRecording(true);
      startRecording(stream);
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const startRecording = async (stream: MediaStream) => {
    audioChunksRef.current = [];
    
    try {
      // Create a MediaRecorder with the stream
      // Use audio/webm MIME type for better compatibility
      const options = { mimeType: 'audio/webm' };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      // Add event handlers for the MediaRecorder
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`Recorded audio chunk: ${event.data.size} bytes`);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          console.log("Recording stopped, processing audio...");
          
          // Create audio blob from recorded chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log(`Total audio size: ${audioBlob.size} bytes`);
          
          if (audioBlob.size < 1000) {
            toast({
              title: "Recording too short",
              description: "Please speak for at least a second",
              variant: "destructive",
              duration: 3000,
            });
            return;
          }
          
          // Show processing indicator
          toast({
            title: "Processing audio",
            description: "Converting your voice to text...",
            duration: 3000,
          });
          
          // Convert blob to base64 for API transmission
          const reader = new FileReader();
          
          reader.onloadend = async () => {
            try {
              // Get base64 audio data
              const base64Audio = reader.result as string;
              setAudioData(base64Audio);
              console.log("Audio data converted to base64 format");
              
              // Process voice input
              await processVoiceInput(base64Audio);
            } catch (error) {
              console.error("Error processing audio data:", error);
              toast({
                title: "Error",
                description: "Failed to process audio data",
                variant: "destructive",
                duration: 3000,
              });
            }
          };
          
          reader.onerror = () => {
            console.error("FileReader error");
            toast({
              title: "Error",
              description: "Failed to read audio data",
              variant: "destructive",
              duration: 3000,
            });
          };
          
          // Start reading the audio blob as data URL
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error("Error in mediaRecorder.onstop:", error);
          toast({
            title: "Error",
            description: "Failed to process recording",
            variant: "destructive",
            duration: 3000,
          });
        }
      };
      
      // Request data every second to handle cases where stop isn't called
      mediaRecorder.start(1000);
      console.log("MediaRecorder started, recording audio...");
      
      // Auto-stop recording after 15 seconds to prevent very long recordings
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          console.log("Maximum recording time reached, stopping...");
          stopRecording();
          toast({
            title: "Recording stopped",
            description: "Maximum recording time reached",
            duration: 3000,
          });
        }
      }, 15000);
      
    } catch (err) {
      console.error("Error starting recording:", err);
      setIsRecording(false);
      
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        // Stop recording
        mediaRecorderRef.current.stop();
        
        // Stop all audio tracks
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        
        toast({
          title: "Recording stopped",
          description: "Processing your voice input...",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error stopping recording:", error);
        
        toast({
          title: "Error",
          description: "Failed to stop recording properly",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const processVoiceInput = async (audioData: string) => {
    setIsLoading(true);
    
    try {
      // Extract the base64 data part if it's a data URL
      const base64Audio = audioData.startsWith('data:') 
        ? audioData.split(',')[1] 
        : audioData;
      
      // Add user message placeholder for voice input
      const userMessage: UserMessage = {
        id: conversations.length + 1,
        sender: "user",
        message: "🎤 Voice message...",
        timestamp: "Just now",
      };
      
      // Add temporary user message to show voice is being processed
      setConversations(prevConversations => [...prevConversations, userMessage]);
      
      // User profile data
      const userProfile = {
        name: "Priya",
        level: "Beginner",
        courses: ["Digital Literacy Fundamentals", "Basic Data Entry Skills"],
        progress: 68,
        skills: ["basic computer", "typing", "beginner excel"]
      };
      
      // Create a conversational history format
      const conversationHistory = conversations
        .map(msg => `${msg.sender === 'ai' ? 'Assistant' : 'User'}: ${msg.message}`)
        .join('\n');
        
      // Call our API with the audio data
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "", // Empty as we're using voice
          language: language,
          isVoice: true,
          isMuted: isMuted,
          audioData: base64Audio,
          conversationHistory: conversationHistory,
          userProfile: userProfile
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Voice API response:", result);
      
      // If we got a transcript, update the input field and user message
      if (result.transcribedQuery) {
        // Update the input field
        setMessage(result.transcribedQuery);
        
        // Update the user message with the transcribed text
        setConversations(prevConversations => {
          const updatedConversations = [...prevConversations];
          // Find the last user message and update it
          const lastUserMessageIndex = updatedConversations.length - 1;
          if (lastUserMessageIndex >= 0 && updatedConversations[lastUserMessageIndex].sender === 'user') {
            updatedConversations[lastUserMessageIndex] = {
              ...updatedConversations[lastUserMessageIndex],
              message: result.transcribedQuery
            };
          }
          return updatedConversations;
        });
      } else {
        // If no transcription was returned, update the placeholder message
        setConversations(prevConversations => {
          const updatedConversations = [...prevConversations];
          const lastUserMessageIndex = updatedConversations.length - 1;
          if (lastUserMessageIndex >= 0 && updatedConversations[lastUserMessageIndex].sender === 'user') {
            updatedConversations[lastUserMessageIndex] = {
              ...updatedConversations[lastUserMessageIndex],
              message: "Voice input (no transcription available)"
            };
          }
          return updatedConversations;
        });
      }
      
      // Track if response came from Ollama
      setLastResponseFromOllama(result.fromOllama || false);
      
      // Add AI response
      const aiMessage: AIMessage = {
        id: conversations.length + 2,
        sender: "ai",
        message: result.response,
        timestamp: "Just now",
        emotion: determineEmotion(result.response),
      };
      
      setConversations(prevConversations => [...prevConversations, aiMessage]);
      
      // If audio URL is available and not muted, play it
      if (result.audioUrl && !isMuted) {
        new Audio(result.audioUrl).play();
      }
    } catch (error) {
      console.error("Error processing voice input:", error);
      
      // Update the user message to indicate failure
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        const lastUserMessageIndex = updatedConversations.findIndex(
          msg => msg.sender === 'user' && msg.message === "🎤 Voice message..."
        );
        
        if (lastUserMessageIndex >= 0) {
          updatedConversations[lastUserMessageIndex] = {
            ...updatedConversations[lastUserMessageIndex],
            message: "⚠️ Voice input failed. Please try again."
          };
        }
        
        return updatedConversations;
      });
      
      // Add error message from AI
      const errorMessage: AIMessage = {
        id: conversations.length + 2,
        sender: "ai",
        message: "I couldn't process your voice input. Could you please try again or type your message?",
        timestamp: "Just now",
        emotion: "empathy",
      };
      
      setConversations(prevConversations => [...prevConversations, errorMessage]);
      setLastResponseFromOllama(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine emotion
  const determineEmotion = (text: string): AIMessage["emotion"] => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("understand") || 
        lowerText.includes("feel") || 
        lowerText.includes("difficult") ||
        lowerText.includes("worry") || 
        lowerText.includes("challenge")) {
      return "empathy";
    } 
    
    if (lowerText.includes("great") || 
        lowerText.includes("progress") || 
        lowerText.includes("excellent") ||
        lowerText.includes("well done") ||
        lowerText.includes("proud")) {
      return "encouraging";
    }
    
    return "helpful";
  };

  // Return a loading state until client-side code is ready
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="mb-4 text-vikasini-orange animate-pulse">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-muted-foreground">Loading AI Mentor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast notification container */}
      <Toaster />
      
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('mentor.title') || "AI Mentor"}</h1>
        <p className="text-muted-foreground">
          {t('mentor.subtitle') || "Your personalized AI mentor to guide your learning journey and provide emotional support"}
          {ollamaAvailable && (
            <span className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
              Powered by Ollama (llama3)
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-13rem)]">
            <CardHeader className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-vikasini-orange">
                    <AvatarImage src={getUnsplashImage("ai assistant robot digital", 40, 40)} alt="AI Mentor" />
                    <AvatarFallback className="bg-vikasini-orange text-white">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{t('mentor.title') || "Vikasini AI Mentor"}</CardTitle>
                    <CardDescription>{t('mentor.description') || "Always here to help"}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                {lastResponseFromOllama && (
                  <span className="text-xs font-medium text-green-600">
                    Response from Ollama
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversations.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user" ? "bg-vikasini-orange text-white" : "bg-muted"
                      }`}
                    >
                      {msg.sender === "ai" && msg.emotion && (
                        <Badge variant="outline" className="mb-2 text-xs bg-white/10">
                          {msg.emotion === "empathy" && "Empathetic Response"}
                          {msg.emotion === "helpful" && "Helpful Guidance"}
                          {msg.emotion === "encouraging" && "Encouragement"}
                        </Badge>
                      )}
                      <p>{msg.message}</p>
                      <div
                        className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button 
                    variant={isRecording ? "destructive" : "outline"} 
                    size="icon" 
                    onClick={toggleRecording}
                    disabled={isLoading}
                    className={isRecording ? "animate-pulse" : ""}
                  >
                    {isRecording ? (
                      <div className="relative">
                        <MicOff className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      </div>
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                  <Input
                    placeholder={isRecording ? "Recording... Click the mic button to stop" : "Type your message..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                    disabled={isLoading || isRecording}
                  />
                  <Button
                    className="bg-vikasini-orange hover:bg-vikasini-orange/90 text-white"
                    onClick={handleSendMessage}
                    disabled={(!message.trim() && !isRecording) || isLoading}
                  >
                    {isLoading ? 
                      <span className="animate-pulse">...</span> : 
                      <Send className="h-4 w-4" />
                    }
                  </Button>
                </div>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center p-6">
                    <img 
                      src="/cutie_thinking.png" 
                      alt="AI thinking" 
                      className="w-48 h-48 object-contain mb-2"
                    />
                    <p className="text-muted-foreground text-sm animate-pulse">
                      {t('mentor.thinking') || "Thinking..."}
                    </p>
                  </div>
                )}
                {isRecording && !isLoading && (
                  <div className="mt-2 text-center text-sm text-red-500">
                    Recording active - speak clearly, then click the mic button to stop
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('mentor.features.title') || "Mentor Features"}</CardTitle>
              <CardDescription>
                {t('mentor.features.description') || "How your AI mentor can help you"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-vikasini-orange/10 p-2 rounded-full">
                  <Headphones className="h-5 w-5 text-vikasini-orange" />
                </div>
                <div>
                  <h3 className="font-medium">{t('mentor.voice.title') || "Voice Support"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('mentor.voice.description') || "Speak in your preferred language for assistance"}
                    {isRecording && <span className="text-red-500 ml-2 animate-pulse">● Recording</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-vikasini-orange/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-vikasini-orange" />
                </div>
                <div>
                  <h3 className="font-medium">{t('mentor.learning.title') || "Learning Guidance"}</h3>
                  <p className="text-sm text-muted-foreground">{t('mentor.learning.description') || "Get help with course content and assignments"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-vikasini-orange/10 p-2 rounded-full">
                  <Briefcase className="h-5 w-5 text-vikasini-orange" />
                </div>
                <div>
                  <h3 className="font-medium">{t('mentor.career.title') || "Career Advice"}</h3>
                  <p className="text-sm text-muted-foreground">{t('mentor.career.description') || "Guidance on job applications and interviews"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-vikasini-orange/10 p-2 rounded-full">
                  <Lightbulb className="h-5 w-5 text-vikasini-orange" />
                </div>
                <div>
                  <h3 className="font-medium">{t('mentor.emotional.title') || "Emotional Support"}</h3>
                  <p className="text-sm text-muted-foreground">{t('mentor.emotional.description') || "Motivation and encouragement when you need it"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('mentor.suggested.title') || "Suggested Topics"}</CardTitle>
              <CardDescription>{t('mentor.suggested.description') || "Questions you might want to ask"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => setMessage(t('mentor.typing.question') || "How can I improve my typing speed for data entry?")}
              >
                {t('mentor.typing.question') || "How can I improve my typing speed for data entry?"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => setMessage(t('mentor.interview.question') || "I'm nervous about my upcoming job interview. Any tips?")}
              >
                {t('mentor.interview.question') || "I'm nervous about my upcoming job interview. Any tips?"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => setMessage(t('mentor.excel.question') || "Can you explain Excel VLOOKUP function in simple terms?")}
              >
                {t('mentor.excel.question') || "Can you explain Excel VLOOKUP function in simple terms?"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => setMessage(t('mentor.email.question') || "How do I create a professional email for job applications?")}
              >
                {t('mentor.email.question') || "How do I create a professional email for job applications?"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
