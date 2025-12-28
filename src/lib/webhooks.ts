import { z } from 'zod';

const N8N_PARTNER_WEBHOOK_URL = 'https://gatsolutions.app.n8n.cloud/webhook/1fda45a1-e714-4447-8886-bd50e0c5116d';
const N8N_IMAGE_GENERATION_WEBHOOK_URL = 'https://gatsolutions.app.n8n.cloud/webhook/8c4406f0-7179-4fd6-a06a-10c8b3c5d7ee';

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

  // Build the request body with prompt and optional images
  const requestBody: {
    prompt: string;
    images?: string[];
  } = {
    prompt: prompt.trim(),
  };

  // Include reference images if provided
  if (referenceImages && referenceImages.length > 0) {
    requestBody.images = referenceImages;
  }

  try {
    const response = await fetch(N8N_IMAGE_GENERATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status} ${response.statusText}`);
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
