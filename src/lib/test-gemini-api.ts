/**
 * Test function to verify the secure image generation service is working
 * Call this from browser console: window.testImageGeneration()
 */

import { generateImageWithGemini, isGeminiConfigured, getAvailableModels } from './gemini-api';

export async function testImageGeneration(prompt: string = 'A beautiful sunset over mountains') {
  console.log('🧪 Testing Secure Image Generation...');
  console.log('');
  console.log('Configuration:', {
    isConfigured: isGeminiConfigured(),
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    availableModels: getAvailableModels(),
  });
  console.log('');

  if (!isGeminiConfigured()) {
    console.error('❌ Service not configured!');
    console.log('');
    console.log('Make sure VITE_SUPABASE_URL is set in Vercel.');
    return;
  }

  console.log('🔒 Security: API key is stored securely in Supabase, not in browser!');
  console.log('');

  try {
    console.log('📤 Sending request with prompt:', prompt);
    console.log('');
    const startTime = Date.now();
    
    const result = await generateImageWithGemini({
      prompt,
      model: 'fast',
    });

    const duration = Date.now() - startTime;
    console.log('✅ Success!', {
      duration: `${(duration / 1000).toFixed(1)}s`,
      imageSize: `${Math.round(result.imageUrl.length / 1024)} KB`,
      mimeType: result.mimeType,
    });
    console.log('');
    
    // Show a preview in console
    console.log('📸 Preview (paste in console to see):');
    console.log(`document.body.innerHTML = '<img src="${result.imageUrl}" style="max-width:100%">'`);
    
    return result;
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Is the Edge Function deployed? Run: supabase functions deploy generate-image');
    console.log('2. Is GEMINI_API_KEY set in Supabase secrets?');
    console.log('3. Check Supabase Dashboard → Edge Functions → Logs');
    throw error;
  }
}

// Make it available globally for easy testing
if (typeof window !== 'undefined') {
  (window as any).testImageGeneration = testImageGeneration;
  // Keep old name for backward compatibility
  (window as any).testGeminiAPI = testImageGeneration;
  console.log('💡 Test ready! Call window.testImageGeneration() in the console.');
}

