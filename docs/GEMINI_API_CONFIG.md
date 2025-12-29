# Gemini API Configuration Guide

## Overview

The application supports two methods for image generation:
1. **N8N Webhook** (default): Uses the existing N8N webhook which may have Gemini/nanobanana configured on the backend
2. **Direct Gemini API**: Connects directly to Google's Gemini API for image generation

## Configuration

### Using N8N Webhook (Default)

No configuration needed. The app will use the existing webhook at:
```
https://gatsolutions.app.n8n.cloud/webhook/8c4406f0-7179-4fd6-a06a-10c8b3c5d7ee
```

If your N8N workflow is configured to use Gemini or nanobanana, this will work automatically.

### Using Direct Gemini API

To use Gemini API directly, configure these environment variables:

#### Required Variables

```bash
# Your Google Gemini API key from Google AI Studio
VITE_GEMINI_API_KEY=your_api_key_here

# Enable direct Gemini API usage
VITE_USE_GEMINI_DIRECT=true
```

#### Optional Variables

```bash
# Gemini model to use (default: imagen-3.0-generate-001)
VITE_GEMINI_MODEL=imagen-3.0-generate-001

# Or use nanobanana if it's a custom model/endpoint
# VITE_GEMINI_MODEL=nanobanana

# API endpoint (default: Google's standard endpoint)
VITE_GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
```

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your environment variables

## Nanobanana Configuration

If "nanobanana" is a specific model or endpoint:

### Option 1: Custom Model Name
```bash
VITE_GEMINI_MODEL=nanobanana
VITE_USE_GEMINI_DIRECT=true
```

### Option 2: Custom Endpoint
```bash
VITE_GEMINI_ENDPOINT=https://your-custom-endpoint.com/v1
VITE_GEMINI_MODEL=nanobanana
VITE_USE_GEMINI_DIRECT=true
```

### Option 3: Via N8N Webhook (Recommended)
Configure nanobanana in your N8N workflow and leave `VITE_USE_GEMINI_DIRECT` unset or false.

## Image Generation Features

### Automatic Style Enhancement

All generated images automatically include the following style:
```
photorealistic cinematic portrait, the lighting is natural and slightly 
underexposed, The image should look like real analog film photography, 
not CGI, not 3D, not cartoon, not glossy.
```

This is applied automatically via the prompt enhancement system in `src/lib/prompt-enhancement.ts`.

### Progress Tracking Elements

Images are generated with trackable elements that can be updated over time to show progress, such as:
- Books that can gain titles and change appearance
- Milestones that can be filled in
- Visual indicators of achievements

### Performance

- **Timeout**: 60 seconds maximum per image generation
- **Fallback**: If direct Gemini API fails, falls back to N8N webhook
- **Error Handling**: Graceful error messages with retry and skip options

## Troubleshooting

### Images not generating

1. **Check API Key**: Ensure `VITE_GEMINI_API_KEY` is set correctly
2. **Check Permissions**: Verify your API key has image generation permissions
3. **Check Webhook**: If using webhook, verify the N8N workflow is running
4. **Check Console**: Look for error messages in browser developer console

### Slow image generation

1. **Network**: Check your internet connection
2. **API Limits**: You may have hit rate limits (check Google Cloud Console)
3. **Model**: Try switching between direct API and webhook
4. **Timeout**: Images taking longer than 60 seconds will timeout with option to skip

### Nanobanana not working

1. **Verify Configuration**: Ensure the model name/endpoint is correct
2. **Check N8N**: If using webhook, verify nanobanana is configured in N8N
3. **Contact Admin**: If nanobanana is custom, contact your system administrator

## Testing

To test the configuration:

1. Start the development server: `npm run dev`
2. Go through onboarding to step 8 (image generation)
3. Check browser console for logs:
   - "Using Gemini API for image generation" = Direct API
   - "Using webhook for image generation" = N8N webhook
4. Verify image generates successfully

## Architecture

```
User Input → Prompt Enhancement → Image Generation
                                       ↓
                          ┌─────────────┴─────────────┐
                          ↓                           ↓
                   Gemini API Direct          N8N Webhook
                  (if configured)          (default/fallback)
                          ↓                           ↓
                          └─────────────┬─────────────┘
                                       ↓
                                Generated Image
```

## Files Modified

- `src/lib/gemini-api.ts`: Direct Gemini API integration
- `src/lib/webhooks.ts`: Updated to support both methods
- `src/lib/prompt-enhancement.ts`: Automatic style enhancement
- `src/components/onboarding/steps/GeneratingStep.tsx`: Uses enhanced prompts

## Support

For issues with:
- **Gemini API**: Check [Google AI documentation](https://ai.google.dev/docs)
- **N8N Webhook**: Contact your N8N administrator
- **Nanobanana**: Contact the system administrator who configured it

