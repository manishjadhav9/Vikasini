import { NextRequest, NextResponse } from 'next/server';
import { getUnsplashImage } from "@/lib/utils"

// Mock database for community posts
let posts = [
  {
    id: '1',
    title: 'Data Entry Certification',
    content: 'Has anyone completed the data entry certification? I\'m looking for study tips!',
    author: {
      id: '1',
      name: 'Meera K.',
      avatar: getUnsplashImage("indian woman professional", 40, 40)
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    replies: [
      {
        id: '1-1',
        content: 'I completed it last month. Focus on accuracy over speed initially!',
        author: {
          id: '2',
          name: 'Anjali T.',
          avatar: getUnsplashImage("indian woman professional", 40, 40)
        },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
      },
      {
        id: '1-2',
        content: 'The excel formulas part was challenging. I can share my notes if you want.',
        author: {
          id: '3',
          name: 'Lakshmi R.',
          avatar: getUnsplashImage("indian woman professional", 40, 40)
        },
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      }
    ]
  },
  {
    id: '2',
    title: 'First Freelance Job',
    content: 'Just got my first freelance job through the platform! So excited!',
    author: {
      id: '2',
      name: 'Anjali T.',
      avatar: getUnsplashImage("indian woman professional", 40, 40)
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    replies: [
      {
        id: '2-1',
        content: 'Congratulations! What type of work will you be doing?',
        author: {
          id: '1',
          name: 'Meera K.',
          avatar: getUnsplashImage("indian woman professional", 40, 40)
        },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      },
      {
        id: '2-2',
        content: 'That\'s amazing! I hope to get my first job soon too.',
        author: {
          id: '4',
          name: 'Priyanka M.',
          avatar: getUnsplashImage("indian woman professional", 40, 40)
        },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
      }
    ]
  },
  {
    id: '3',
    title: 'Digital Literacy Study Group',
    content: 'I\'m organizing a study group for the digital literacy course. Anyone interested?',
    author: {
      id: '3',
      name: 'Lakshmi R.',
      avatar: getUnsplashImage("indian woman professional", 40, 40)
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    replies: [
      {
        id: '3-1',
        content: 'I\'m interested! When are you planning to meet?',
        author: {
          id: '4',
          name: 'Priyanka M.',
          avatar: getUnsplashImage("indian woman professional", 40, 40)
        },
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() // 20 hours ago
      }
    ]
  },
  {
    id: '4',
    title: 'Communication Skills Notes',
    content: 'Sharing my notes from the communication skills module. Hope it helps!',
    author: {
      id: '4',
      name: 'Priyanka M.',
      avatar: getUnsplashImage("indian woman professional", 40, 40)
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    replies: [
      {
        id: '4-1',
        content: 'Thank you so much for sharing! This is very helpful.',
        author: {
          id: '1',
          name: 'Meera K.',
          avatar: getUnsplashImage("indian woman professional", 40, 40)
        },
        createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString() // 1.5 days ago
      },
      {
        id: '4-2',
        content: 'I\'ve been struggling with this module. Could you share some tips?',
        author: {
          id: '2',
          name: 'Anjali T.',
          avatar: getUnsplashImage("indian woman professional", 40, 40)
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    ]
  }
];

// Replace placeholder avatars with Unsplash image URLs
const professionalWomanAvatar = getUnsplashImage("indian woman professional", 40, 40);

// GET handler to retrieve all posts or a specific post by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    
    if (postId) {
      // Return a specific post
      const post = posts.find(p => p.id === postId);
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      
      return NextResponse.json({ post });
    }
    
    // Return all posts (could add pagination here in a real app)
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error in community GET API:', error);
    return NextResponse.json({ error: 'Failed to retrieve posts' }, { status: 500 });
  }
}

// POST handler to create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId, authorName, authorAvatar } = body;
    
    // Validate required fields
    if (!title || !content || !authorId || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create a new post
    const newPost = {
      id: (posts.length + 1).toString(),
      title,
      content,
      author: {
        id: authorId,
        name: authorName,
        avatar: authorAvatar || getUnsplashImage("indian woman professional", 40, 40)
      },
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    // Add to mock database
    posts = [newPost, ...posts];
    
    return NextResponse.json({ post: newPost, message: 'Post created successfully' });
  } catch (error) {
    console.error('Error in community POST API:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// POST handler for adding a reply to a post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, content, authorId, authorName, authorAvatar } = body;
    
    // Validate required fields
    if (!postId || !content || !authorId || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Find the post
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Create a new reply
    const newReply = {
      id: `${postId}-${posts[postIndex].replies.length + 1}`,
      content,
      author: {
        id: authorId,
        name: authorName,
        avatar: authorAvatar || getUnsplashImage("indian woman professional", 40, 40)
      },
      createdAt: new Date().toISOString()
    };
    
    // Add reply to post
    posts[postIndex].replies.push(newReply);
    
    return NextResponse.json({ 
      reply: newReply,
      post: posts[postIndex],
      message: 'Reply added successfully' 
    });
  } catch (error) {
    console.error('Error in community PUT API:', error);
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}

// DELETE handler to remove a post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    
    // Remove the post
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== postId);
    
    if (posts.length === initialLength) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in community DELETE API:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
} 