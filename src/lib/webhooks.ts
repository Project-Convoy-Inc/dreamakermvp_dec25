import { z } from 'zod';
import { generateImageWithGemini, isGeminiConfigured } from './gemini-api';

const N8N_PARTNER_WEBHOOK_URL = 'https://gatsolutions.app.n8n.cloud/webhook/1fda45a1-e714-4447-8886-bd50e0c5116d';
const N8N_IMAGE_GENERATION_WEBHOOK_URL = 'https://gatsolutions.app.n8n.cloud/webhook/8c4406f0-7179-4fd6-a06a-10c8b3c5d7ee';

// Configuration: Use Gemini API directly or via webhook
const USE_GEMINI_DIRECT = import.meta.env.VITE_USE_GEMINI_DIRECT === 'true';

// #region agent log
const webhookEnvCheck = {
  location: 'webhooks.ts:8',
  message: 'Module load config check',
  data: {
    useGeminiDirect: USE_GEMINI_DIRECT,
    rawEnvValue: import.meta.env.VITE_USE_GEMINI_DIRECT || 'not set',
    envValueType: typeof import.meta.env.VITE_USE_GEMINI_DIRECT,
    isGeminiConfigured: isGeminiConfigured(),
    allViteEnvKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
  },
  timestamp: Date.now(),
  sessionId: 'debug-session',
  runId: 'run2',
  hypothesisId: 'A'
};
console.log('[DEBUG WEBHOOK ENV CHECK]', webhookEnvCheck);
fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(webhookEnvCheck)}).catch((e)=>console.error('[DEBUG FETCH ERROR]',e));
// #endregion

export const partnerWebhookSchema = z.object({
  partnerName: z.string().trim().min(1).max(100),
  partnerEmail: z.string().trim().email().max(255),
  userName: z.string().trim().min(1).max(100),
});

export type PartnerWebhookData = z.infer<typeof partnerWebhookSchema>;

export async function triggerPartnerAddedWebhook(data: PartnerWebhookData): Promise<void> {
  const validated = partnerWebhookSchema.parse(data);

  try {
    await fetch(N8N_PARTNER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        event: 'partner_added',
        partnerName: validated.partnerName,
        partnerEmail: validated.partnerEmail,
        userName: validated.userName,
        timestamp: new Date().toISOString(),
      }),
    });
    console.log('Partner webhook triggered successfully');
  } catch (error) {
    console.error('Failed to trigger partner webhook:', error);
    // Don't throw - webhook failure shouldn't block the UI
  }
}

export interface ImageGenerationData {
  prompt: string;
  referenceImages?: string[]; // Array of base64 image strings
}

export async function generateImageWithWebhook(data: ImageGenerationData): Promise<string> {
  const { prompt, referenceImages } = data;

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:48',message:'generateImageWithWebhook entry',data:{promptLength:prompt?.length,hasReferenceImages:!!referenceImages?.length,useGeminiDirect:USE_GEMINI_DIRECT,isGeminiConfigured:isGeminiConfigured()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (!prompt.trim()) {
    throw new Error('Prompt is required');
  }

  // Option 1: Use Gemini API directly if configured
  if (USE_GEMINI_DIRECT && isGeminiConfigured()) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:56',message:'Attempting direct Gemini API',data:{useGeminiDirect:USE_GEMINI_DIRECT,isGeminiConfigured:isGeminiConfigured()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
      console.log('Using Gemini nanobanana (gemini-3-pro-image-preview) for image generation');
      const result = await generateImageWithGemini({
        prompt: prompt.trim(),
        aspectRatio: '1:1',
        numberOfImages: 1,
        safetySettings: 'block_few',
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:65',message:'Direct Gemini API success',data:{imageUrlLength:result.imageUrl?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return result.imageUrl;
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:67',message:'Direct Gemini API failed, falling back',data:{errorName:error instanceof Error?error.name:'unknown',errorMessage:error instanceof Error?error.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error('Gemini API generation failed, falling back to webhook:', error);
      // Fall through to webhook method
    }
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:70',message:'Skipping direct API, using webhook',data:{useGeminiDirect:USE_GEMINI_DIRECT,isGeminiConfigured:isGeminiConfigured()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }

  // Option 2: Use N8N webhook (should use Gemini nanobanana on backend)
  try {
    console.log('Using webhook for image generation (expecting Gemini nanobanana)');
    
    // Build the request body with prompt and optional images
    const requestBody: {
      prompt: string;
      images?: string[];
      model?: string; // Specify model for webhook
    } = {
      prompt: prompt.trim(),
      model: 'gemini-3-pro-image-preview', // Ensure webhook uses correct model
    };

    // Include reference images if provided
    if (referenceImages && referenceImages.length > 0) {
      requestBody.images = referenceImages;
    }

    // #region agent log
    const logData1 = {location:'webhooks.ts:91',message:'Before webhook fetch',data:{webhookUrl:N8N_IMAGE_GENERATION_WEBHOOK_URL,requestBodyKeys:Object.keys(requestBody),hasImages:!!requestBody.images?.length,promptLength:requestBody.prompt?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG]', logData1);
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch((e)=>console.error('[DEBUG FETCH ERROR]',e));
    // #endregion

    console.log('[DEBUG] About to fetch webhook:', N8N_IMAGE_GENERATION_WEBHOOK_URL);
    
    let response: Response;
    try {
      response = await fetch(N8N_IMAGE_GENERATION_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError) {
      // #region agent log
      const logFetchError = {location:'webhooks.ts:119',message:'Fetch call failed',data:{errorName:fetchError instanceof Error?fetchError.name:'unknown',errorMessage:fetchError instanceof Error?fetchError.message:'unknown',isTypeError:fetchError instanceof TypeError,isNetworkError:fetchError instanceof TypeError&&fetchError.message.includes('fetch')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
      console.error('[DEBUG] Fetch error:', logFetchError);
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logFetchError)}).catch((e)=>console.error('[DEBUG FETCH ERROR]',e));
      // #endregion
      
      // Provide helpful error message
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error(
          'Network error: Unable to reach image generation service. ' +
          'This may be due to CORS restrictions or network connectivity. ' +
          'Please ensure VITE_USE_GEMINI_DIRECT=true and VITE_GEMINI_API_KEY are set in your environment variables to use direct API access.'
        );
      }
      throw fetchError;
    }

    // #region agent log
    const logData2 = {location:'webhooks.ts:99',message:'After webhook fetch',data:{responseOk:response.ok,responseStatus:response.status,responseStatusText:response.statusText,responseType:response.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG]', logData2);
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch((e)=>console.error('[DEBUG FETCH ERROR]',e));
    // #endregion

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:102',message:'Webhook response not ok',data:{status:response.status,statusText:response.statusText,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      throw new Error(`Image generation failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    // The webhook returns a binary image file
    const blob = await response.blob();
    
    // Convert blob to base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:115',message:'Webhook success, image converted',data:{resultLength:result?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        resolve(result);
      };
      reader.onerror = () => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'webhooks.ts:118',message:'FileReader error',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        reject(new Error('Failed to convert image to data URL'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // #region agent log
    const logData3 = {location:'webhooks.ts:122',message:'Webhook catch block',data:{errorName:error instanceof Error?error.name:'unknown',errorMessage:error instanceof Error?error.message:'unknown',isTypeError:error instanceof TypeError,errorStack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
    console.error('[DEBUG] Webhook error:', logData3);
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData3)}).catch((e)=>console.error('[DEBUG FETCH ERROR]',e));
    // #endregion
    console.error('Failed to generate image:', error);
    throw error;
  }
}
