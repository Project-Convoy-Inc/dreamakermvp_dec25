/**
 * Supabase Edge Function: Generate Image
 * 
 * This function securely calls Google's Gemini Nano Banana API.
 * The API key is stored as a Supabase secret, never exposed to users.
 * 
 * Nano Banana Models:
 * - gemini-2.5-flash-image: Fast, efficient (default)
 * - gemini-3-pro-image-preview: Professional quality with "Thinking"
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// API Configuration - stored securely in Supabase secrets
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";

// Available Nano Banana models
const MODELS = {
  fast: "gemini-2.5-flash-image",
  pro: "gemini-3-pro-image-preview",
} as const;

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  prompt: string;
  model?: "fast" | "pro";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { prompt, model = "fast" } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt is required and must be a non-empty string" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check API key configuration
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY secret is not configured");
      return new Response(
        JSON.stringify({ error: "Image generation service is not configured. Please contact support." }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get the model name
    const modelName = MODELS[model] || MODELS.fast;
    console.log(`Generating image with ${modelName}...`);

    // Call Gemini API
    const geminiResponse = await fetch(
      `${GEMINI_ENDPOINT}/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt.trim()
                }
              ]
            }
          ]
        }),
      }
    );

    // Handle Gemini API errors
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}));
      console.error("Gemini API error:", errorData);
      
      const errorMessage = errorData.error?.message || `API request failed with status ${geminiResponse.status}`;
      
      // Map common errors to user-friendly messages
      let userMessage = "Failed to generate image. Please try again.";
      if (geminiResponse.status === 401) {
        userMessage = "Authentication failed. Please contact support.";
      } else if (geminiResponse.status === 429) {
        userMessage = "Too many requests. Please wait a moment and try again.";
      } else if (geminiResponse.status === 400) {
        userMessage = "Your prompt couldn't be processed. Try rephrasing it.";
      }
      
      return new Response(
        JSON.stringify({ error: userMessage, details: errorMessage }),
        { 
          status: geminiResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse response
    const data = await geminiResponse.json();

    // Find image in response
    const candidate = data.candidates?.[0];
    if (!candidate?.content?.parts) {
      console.error("No content in response:", data);
      return new Response(
        JSON.stringify({ error: "No content was generated. Please try a different prompt." }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Look for image data in parts
    const imagePart = candidate.content.parts.find(
      (part: { inlineData?: { mimeType?: string; data?: string } }) =>
        part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData) {
      // Check if there's a text response we can return as error info
      const textPart = candidate.content.parts.find(
        (part: { text?: string }) => part.text
      );
      console.error("No image in response. Text response:", textPart?.text);
      
      return new Response(
        JSON.stringify({ 
          error: "No image was generated. The model may have responded with text instead.",
          modelResponse: textPart?.text || null
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Success! Return the image as base64 data URL
    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({
        imageUrl,
        mimeType: imagePart.inlineData.mimeType,
        model: modelName,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

