/**
 * Google Gemini API Provider (Secure)
 * 
 * Calls a Supabase Edge Function to generate images.
 * The API key is stored securely in Supabase secrets, NOT in the browser.
 * 
 * Architecture:
 * Browser → Supabase Edge Function → Google Gemini API
 *                    ↑
 *          GEMINI_API_KEY stored here (hidden from users)
 */

// Supabase URL (safe to expose - it's meant to be public)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const GENERATION_TIMEOUT = 90000; // 90 seconds

const NANO_BANANA_MODELS = {
  fast: 'gemini-2.5-flash-image',
  pro: 'gemini-3-pro-image-preview',
} as const;

export interface GeminiImageParams {
  prompt: string;
  model?: 'fast' | 'pro';
}

export interface GeminiImageResponse {
  imageUrl: string;
  mimeType: string;
}

/**
 * Generates an image via secure Supabase Edge Function
 * The Edge Function calls Google's Gemini API with the secret key
 */
export async function generateImageWithGemini({
  prompt,
  model = 'fast',
}: GeminiImageParams): Promise<GeminiImageResponse> {
  if (!SUPABASE_URL) {
    throw new Error(
      'Supabase URL is not configured. Please set VITE_SUPABASE_URL environment variable.'
    );
  }

  if (!SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase anon key is not configured. Please set VITE_SUPABASE_ANON_KEY environment variable.'
    );
  }

  const endpoint = `${SUPABASE_URL}/functions/v1/generate-image`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT);

    console.log(`Generating image with Nano Banana (${NANO_BANANA_MODELS[model]})...`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ prompt, model }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      // Use the error message from the Edge Function
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    if (!data.imageUrl) {
      throw new Error('No image was returned from the server');
    }

    return {
      imageUrl: data.imageUrl,
      mimeType: data.mimeType || 'image/png',
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Image generation timed out. Please try again.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred during image generation');
  }
}

/**
 * Check if Gemini is configured
 * (Only checks Supabase URL - the Edge Function handles the API key)
 */
export function isGeminiConfigured(): boolean {
  return !!SUPABASE_URL;
}

/**
 * Get available Nano Banana models
 */
export function getAvailableModels() {
  return NANO_BANANA_MODELS;
}
