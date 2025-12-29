/**
 * Simple test function to test Gemini API directly
 * Call this from browser console: window.testGeminiAPI()
 */

import { generateImageWithGemini, isGeminiConfigured } from './gemini-api';

export async function testGeminiAPI(prompt: string = 'A beautiful sunset over mountains') {
  console.log('🧪 Testing Gemini API...');
  console.log('Configuration:', {
    isConfigured: isGeminiConfigured(),
    hasApiKey: !!import.meta.env.VITE_GEMINI_API_KEY || !!import.meta.env.VITE_GEMINI_KEY,
    apiKeySource: import.meta.env.VITE_GEMINI_API_KEY ? 'VITE_GEMINI_API_KEY' : 
                  import.meta.env.VITE_GEMINI_KEY ? 'VITE_GEMINI_KEY' : 'none',
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-3-pro-image-preview',
    useDirect: import.meta.env.VITE_USE_GEMINI_DIRECT,
  });

  if (!isGeminiConfigured()) {
    console.error('❌ Gemini API is not configured!');
    console.log('Please set VITE_GEMINI_API_KEY or VITE_GEMINI_KEY in your environment variables.');
    return;
  }

  try {
    console.log('📤 Sending request with prompt:', prompt);
    const startTime = Date.now();
    
    const result = await generateImageWithGemini({
      prompt,
      aspectRatio: '1:1',
      numberOfImages: 1,
      safetySettings: 'block_few',
    });

    const duration = Date.now() - startTime;
    console.log('✅ Success!', {
      duration: `${duration}ms`,
      imageUrlLength: result.imageUrl?.length,
      mimeType: result.mimeType,
    });
    console.log('Image URL (first 100 chars):', result.imageUrl?.substring(0, 100) + '...');
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

// Make it available globally for easy testing
if (typeof window !== 'undefined') {
  (window as any).testGeminiAPI = testGeminiAPI;
  console.log('💡 Test function available! Call window.testGeminiAPI() in the console to test.');
}

