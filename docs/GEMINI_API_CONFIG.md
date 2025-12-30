# Secure Image Generation Configuration

## Overview

The application uses **Google Gemini Nano Banana** for image generation, with the API key **securely stored in Supabase** (not exposed to browsers).

### Security Architecture

```
User's Browser → Supabase Edge Function → Google Gemini API
                        ↑
                GEMINI_API_KEY stored here
                (never sent to browser)
```

This means:
- ✅ Your API key is **never exposed** to users
- ✅ Users can't steal your key from browser DevTools
- ✅ You can monitor/rate-limit usage through Supabase

---

## Setup Instructions

### Step 1: Set the Secret in Supabase

**Option A: Via CLI**
```bash
cd /path/to/your/project
supabase secrets set GEMINI_API_KEY=your_google_api_key_here
```

**Option B: Via Dashboard**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** → **Edge Functions**
4. Click **Manage Secrets**
5. Add: `GEMINI_API_KEY` = `your_google_api_key_here`

### Step 2: Deploy the Edge Function

```bash
cd /path/to/your/project
supabase functions deploy generate-image
```

### Step 3: Verify Vercel Environment

Make sure `VITE_SUPABASE_URL` is set in Vercel (this should already be there).

---

## Getting a Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to Supabase secrets (NOT Vercel!)

---

## Available Models (Nano Banana)

| Model | ID | Best For |
|-------|-----|----------|
| **Fast** | `gemini-2.5-flash-image` | Speed, high-volume (default) |
| **Pro** | `gemini-3-pro-image-preview` | Quality, complex prompts |

---

## File Structure

```
src/lib/
├── gemini-api.ts         # Frontend - calls Edge Function
├── image-service.ts      # Service wrapper with error handling
└── test-gemini-api.ts    # Testing utility

supabase/functions/
└── generate-image/
    └── index.ts          # Edge Function - calls Google API
```

---

## Testing

### Browser Console Test

Open your deployed app and run:

```javascript
window.testImageGeneration("A beautiful sunset over mountains")
```

### Expected Output

```
🧪 Testing Secure Image Generation...

Configuration: { isConfigured: true, supabaseUrl: '✅ Set', ... }

🔒 Security: API key is stored securely in Supabase, not in browser!

📤 Sending request with prompt: A beautiful sunset over mountains

✅ Success! { duration: "5.2s", imageSize: "128 KB", mimeType: "image/png" }
```

---

## Troubleshooting

### "Supabase URL is not configured"
- Check Vercel → Environment Variables
- Ensure `VITE_SUPABASE_URL` is set

### "Image generation service is not configured"
- The Edge Function can't find `GEMINI_API_KEY`
- Run: `supabase secrets set GEMINI_API_KEY=your_key`
- Or add it via Supabase Dashboard → Project Settings → Edge Functions → Secrets

### "Authentication failed"
- Your Google API key is invalid or expired
- Get a new key from [Google AI Studio](https://aistudio.google.com)

### "Too many requests"
- You've hit Google's rate limit
- Wait a minute and try again

### Edge Function not working
1. Check if deployed: `supabase functions list`
2. View logs: Supabase Dashboard → Edge Functions → Logs
3. Redeploy: `supabase functions deploy generate-image`

---

## Local Development

For local development, you need the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run functions locally
supabase functions serve
```

Then set a local `.env` file for the function:
```bash
# supabase/functions/.env
GEMINI_API_KEY=your_key_here
```

---

## Security Notes

- **Never** put `GEMINI_API_KEY` in Vercel or any frontend environment variable
- **Never** commit API keys to git
- The `VITE_SUPABASE_URL` is safe to expose (it's meant to be public)
- Consider adding rate limiting in the Edge Function for production

---

## Support

- **Gemini API**: [Google AI Documentation](https://ai.google.dev/docs)
- **Supabase Edge Functions**: [Supabase Docs](https://supabase.com/docs/guides/functions)
- **API Keys**: [Google AI Studio](https://aistudio.google.com)
