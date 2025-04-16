import { NextResponse } from 'next/server';

/**
 * Status endpoint to check if the mentor API and Ollama are available
 */
export async function HEAD() {
  try {
    // Check if Ollama is available
    const isOllamaAvailable = await checkOllamaStatus();
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('API status check failed:', error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if Ollama is available
    const isOllamaAvailable = await checkOllamaStatus();
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Mentor API is available',
      ollama: {
        available: isOllamaAvailable,
        model: isOllamaAvailable ? 'llama3' : null
      }
    });
  } catch (error) {
    console.error('API status check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Mentor API is unavailable',
        ollama: {
          available: false,
          model: null
        }
      }, 
      { status: 500 }
    );
  }
}

/**
 * Check if Ollama is running and available
 */
async function checkOllamaStatus(): Promise<boolean> {
  try {
    // Try to call Ollama API
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET'
    });
    
    if (!response.ok) {
      return false;
    }
    
    // Check if llama3 model is available
    const data = await response.json();
    const hasLlama3 = data.models && data.models.some((model: any) => 
      model.name === 'llama3' || model.name.startsWith('llama3:')
    );
    
    return hasLlama3;
  } catch (error) {
    console.error('Ollama check failed:', error);
    return false;
  }
} 