import { z } from 'zod';
import { generateImageWithGemini, isGeminiConfigured } from './gemini-api';

const N8N_PARTNER_WEBHOOK_URL = 'https://gatsolutions.app.n8n.cloud/webhook/1fda45a1-e714-4447-8886-bd50e0c5116d';
const N8N_IMAGE_GENERATION_WEBHOOK_URL = 'https://gatsolutions.app.n8n.cloud/webhook/8c4406f0-7179-4fd6-a06a-10c8b3c5d7ee';

// Configuration: Use Gemini API directly or via webhook
const USE_GEMINI_DIRECT = import.meta.env.VITE_USE_GEMINI_DIRECT === 'true';

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

  if (!prompt.trim()) {
    throw new Error('Prompt is required');
  }

  // Option 1: Use Gemini API directly if configured
  if (USE_GEMINI_DIRECT && isGeminiConfigured()) {
    try {
      console.log('Using Gemini nanobanana (gemini-3-pro-image-preview) for image generation');
      const result = await generateImageWithGemini({
        prompt: prompt.trim(),
        aspectRatio: '1:1',
        numberOfImages: 1,
        safetySettings: 'block_few',
      });
      return result.imageUrl;
    } catch (error) {
      console.error('Gemini API generation failed, falling back to webhook:', error);
      // Fall through to webhook method
    }
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

    const response = await fetch(N8N_IMAGE_GENERATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Image generation failed: ${response.status} ${response.statusText}. ${errorText}`);
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
    console.error('Failed to generate image:', error);
    throw error;
  }
}
