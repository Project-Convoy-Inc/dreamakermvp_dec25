/**
 * Google Gemini API Integration for Image Generation
 * Supports fast image generation with configurable models (including "nanobanana" if custom)
 */

// Configuration - can be set via environment variables
// Support both VITE_GEMINI_API_KEY and VITE_GEMINI_KEY for flexibility
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3-pro-image-preview'; // Default to nanobanana model
const GEMINI_ENDPOINT = import.meta.env.VITE_GEMINI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta';

// #region agent log
const envCheck = {
  location: 'gemini-api.ts:9',
  message: 'Environment variables check',
  data: {
    hasApiKey: !!GEMINI_API_KEY,
    apiKeyLength: GEMINI_API_KEY?.length || 0,
    apiKeyPrefix: GEMINI_API_KEY?.substring(0, 10) || 'none',
    model: GEMINI_MODEL,
    endpoint: GEMINI_ENDPOINT,
    rawEnvApiKey: import.meta.env.VITE_GEMINI_API_KEY ? 'present' : 'missing',
    rawEnvModel: import.meta.env.VITE_GEMINI_MODEL || 'not set',
    rawEnvUseDirect: import.meta.env.VITE_USE_GEMINI_DIRECT || 'not set',
    allEnvKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
  },
  timestamp: Date.now(),
  sessionId: 'debug-session',
  runId: 'run2',
  hypothesisId: 'B'
};
console.log('[DEBUG ENV CHECK]', envCheck);
fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(envCheck)}).catch((e)=>console.error('[DEBUG FETCH ERROR]',e));
// #endregion

// Timeout for image generation (60 seconds max)
const GENERATION_TIMEOUT = 60000;

interface GenerateImageParams {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  numberOfImages?: number;
  safetySettings?: 'block_few' | 'block_some' | 'block_most' | 'block_none';
}

interface GenerateImageResponse {
  imageUrl: string;
  mimeType: string;
}

/**
 * Generates an image using Google Gemini/Imagen API
 */
export async function generateImageWithGemini({
  prompt,
  aspectRatio = '1:1',
  numberOfImages = 1,
  safetySettings = 'block_few',
}: GenerateImageParams): Promise<GenerateImageResponse> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:29',message:'generateImageWithGemini entry',data:{hasApiKey:!!GEMINI_API_KEY,apiKeyLength:GEMINI_API_KEY?.length||0,model:GEMINI_MODEL,endpoint:GEMINI_ENDPOINT},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  if (!GEMINI_API_KEY) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:36',message:'Missing Gemini API key',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY environment variable.');
  }

  // Check if using nanobanana model (custom or specific configuration)
  const modelName = GEMINI_MODEL.includes('nanobanana') ? GEMINI_MODEL : GEMINI_MODEL;
  
  // Construct the API endpoint
  const endpoint = `${GEMINI_ENDPOINT}/models/${modelName}:generateImages?key=${GEMINI_API_KEY}`;

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:43',message:'Before fetch request',data:{endpoint,modelName,hasKeyInUrl:endpoint.includes('key=')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  const requestBody = {
    prompt,
    number_of_images: numberOfImages,
    aspect_ratio: aspectRatio,
    safety_filter_level: safetySettings,
    person_generation: 'allow_all', // Allow generating people in images
  };

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:69',message:'After fetch response',data:{responseOk:response.ok,responseStatus:response.status,responseStatusText:response.statusText,responseType:response.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:72',message:'Response not ok',data:{status:response.status,statusText:response.statusText,errorData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      throw new Error(
        `Gemini API request failed: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ''
        }`
      );
    }

    const data = await response.json();

    if (!data.generatedImages || data.generatedImages.length === 0) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:81',message:'No images in response',data:{hasData:!!data,dataKeys:data?Object.keys(data):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      throw new Error('No images were generated by the Gemini API');
    }

    // Get the first generated image
    const generatedImage = data.generatedImages[0];

    // Convert the base64 image to a data URL
    const imageUrl = `data:${generatedImage.mimeType};base64,${generatedImage.bytesBase64Encoded}`;

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:90',message:'Gemini API success',data:{imageUrlLength:imageUrl?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    return {
      imageUrl,
      mimeType: generatedImage.mimeType || 'image/png',
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini-api.ts:95',message:'Gemini API catch block',data:{errorName:error instanceof Error?error.name:'unknown',errorMessage:error instanceof Error?error.message:'unknown',isTypeError:error instanceof TypeError,isAbortError:error instanceof Error&&error.name==='AbortError'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
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
 * Alternative: Generate image using existing N8N webhook but with Gemini backend
 * This can be used if the webhook is already configured to use Gemini/nanobanana
 */
export async function generateImageViaWebhook(prompt: string): Promise<string> {
  const N8N_IMAGE_GENERATION_WEBHOOK_URL = 
    'https://gatsolutions.app.n8n.cloud/webhook/8c4406f0-7179-4fd6-a06a-10c8b3c5d7ee';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT);

    const response = await fetch(N8N_IMAGE_GENERATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }

    // The webhook returns a binary image file
    const blob = await response.blob();
    
    // Convert blob to base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to convert image to data URL'));
      };
      reader.readAsDataURL(blob);
    });
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
 * Check if Gemini API is properly configured
 */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY && !!GEMINI_MODEL;
}

/**
 * Get the current Gemini model being used
 */
export function getGeminiModel(): string {
  return GEMINI_MODEL;
}

