import { generateImageWithGemini, isGeminiConfigured } from './gemini-api';

export interface ImageGenerationData {
  prompt: string;
  referenceImages?: string[]; // Array of base64 image strings
}

/**
 * Generates an image using Gemini API directly
 * Requires VITE_GEMINI_API_KEY to be set in environment variables
 */
export async function generateImageWithWebhook(data: ImageGenerationData): Promise<string> {
  const { prompt, referenceImages } = data;

  if (!prompt.trim()) {
    throw new Error('Prompt is required');
  }

  // Check if Gemini is configured
  if (!isGeminiConfigured()) {
    throw new Error(
      'Gemini API is not configured. Please set VITE_GEMINI_API_KEY and VITE_GEMINI_MODEL environment variables in Vercel.'
    );
  }

  try {
    console.log('Using Gemini API directly for image generation');
    const result = await generateImageWithGemini({
      prompt: prompt.trim(),
      aspectRatio: '1:1',
      numberOfImages: 1,
      safetySettings: 'block_few',
    });
    return result.imageUrl;
  } catch (error) {
    console.error('Gemini API generation failed:', error);
    throw error;
  }
}
