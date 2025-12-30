/**
 * Unified Image Generation Interface
 * 
 * Provides a single interface for image generation across different providers.
 * Currently uses Gemini as the primary provider, with OpenAI available as an alternative.
 */

import { generateImageWithGemini, isGeminiConfigured } from './providers/gemini';
import { generateImageWithOpenAI, isOpenAIConfigured } from './providers/openai';

export interface ImageGenerationData {
  prompt: string;
  referenceImages?: string[]; // Reserved for future use with image-to-image
  model?: 'fast' | 'pro'; // Gemini model option
  provider?: 'gemini' | 'openai'; // Provider selection
}

/**
 * Generates an image using the configured provider
 * 
 * Priority: Gemini (if configured) > OpenAI (if configured) > Error
 */
export async function generateImage(data: ImageGenerationData): Promise<string> {
  const { prompt, model = 'fast', provider } = data;

  if (!prompt.trim()) {
    throw new Error('Prompt is required');
  }

  // Determine which provider to use
  const useGemini = provider === 'gemini' || (provider !== 'openai' && isGeminiConfigured());
  const useOpenAI = provider === 'openai' || (!isGeminiConfigured() && isOpenAIConfigured());

  if (useGemini) {
    try {
      const result = await generateImageWithGemini({
        prompt: prompt.trim(),
        model,
      });
      return result.imageUrl;
    } catch (error) {
      // Fallback to OpenAI if Gemini fails and OpenAI is available
      if (useOpenAI && provider !== 'gemini') {
        console.warn('Gemini generation failed, falling back to OpenAI:', error);
        return generateImage({ ...data, provider: 'openai' });
      }
      throw error;
    }
  }

  if (useOpenAI) {
    const result = await generateImageWithOpenAI({
      prompt: prompt.trim(),
    });
    return result.imageUrl;
  }

  throw new Error(
    'Image generation is not configured. Please ensure the Supabase Edge Function is deployed and GEMINI_API_KEY secret is set.'
  );
}

/**
 * Check if any image generation provider is configured
 */
export function isImageGenerationConfigured(): boolean {
  return isGeminiConfigured() || isOpenAIConfigured();
}

