import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to check environment configuration
 */
export async function GET() {
  try {
    // Check for environment variables
    const envCheck = {
      sarvamApiKey: Boolean(process.env.SARVAM_API_KEY),
      huggingfaceApiKey: Boolean(process.env.HUGGINGFACE_API_KEY),
      nodeEnv: process.env.NODE_ENV,
      nextPublicUrl: process.env.NEXT_PUBLIC_URL
    };
    
    // Test API accessibility (without sending credentials)
    const apiTests = {
      huggingface: false,
      sarvam: false
    };
    
    try {
      // Test Hugging Face (just connection, not authentication)
      const hfResponse = await fetch("https://api-inference.huggingface.co/", {
        method: "HEAD"
      });
      apiTests.huggingface = hfResponse.ok || hfResponse.status === 401; // 401 means API is accessible but not authenticated
    } catch (e) {
      console.error("Hugging Face API check failed:", e);
    }
    
    try {
      // Test Sarvam (just connection, not authentication)
      const sarvamResponse = await fetch("https://api.sarvam.ai/", {
        method: "HEAD"
      });
      apiTests.sarvam = sarvamResponse.ok || sarvamResponse.status === 401; // 401 means API is accessible but not authenticated
    } catch (e) {
      console.error("Sarvam API check failed:", e);
    }
    
    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      apiAccessibility: apiTests,
      nodeVersion: process.version,
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('API diagnostic check failed:', error);
    return NextResponse.json(
      { status: 'error', message: 'Diagnostic check failed', error: String(error) }, 
      { status: 500 }
    );
  }
} 