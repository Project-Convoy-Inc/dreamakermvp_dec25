# Vercel Staging Environment Setup Guide

This guide will help you set up a staging environment on Vercel, eliminating the need for local `.env` files.

## 🎯 Overview

**What we're setting up:**
- ✅ Production environment (from `main` branch)
- ✅ Staging environment (from `staging` branch)
- ✅ All environment variables managed in Vercel
- ✅ No local `.env` file needed
- ✅ Simplified deployment workflow

---

## 📋 Step-by-Step Setup

### Step 1: Create Staging Branch (Already Done ✅)

The staging branch has been created and pushed. You can verify with:
```bash
git branch -a
```

### Step 2: Configure Vercel Environment Variables

**Go to Vercel Dashboard:**
1. Navigate to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**

**Add these environment variables:**

#### Required Variables:

1. **VITE_SUPABASE_URL**
   - **Value:** Your Supabase project URL
   - **Where to find it:** Supabase Dashboard → Project Settings → API → Project URL
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

2. **VITE_SUPABASE_ANON_KEY**
   - **Value:** Your Supabase anonymous/public key
   - **Where to find it:** Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### Optional Variables:

3. **VITE_OPENAI_API_KEY** (if using OpenAI features)
   - **Value:** Your OpenAI API key
   - **Where to find it:** https://platform.openai.com/api-keys
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **Note:** Only add this if you're using OpenAI for image/text generation

---

### Step 3: Configure Branch Deployments

**In Vercel Dashboard → Settings → Git:**

1. **Production Branch:** Set to `main` (or `master` if that's your default)
2. **Automatic Deployments:**
   - ✅ Production: Enabled for `main` branch
   - ✅ Preview: Enabled for all branches (including `staging`)
   - ✅ Development: Optional (can use Preview for staging)

**How it works:**
- Pushing to `main` → Deploys to **Production** URL
- Pushing to `staging` → Deploys to **Preview** URL (staging environment)
- Pushing to any other branch → Deploys to **Preview** URL

---

### Step 4: Verify Your Setup

After adding environment variables, you should see:

**In Vercel Dashboard → Settings → Environment Variables:**
```
VITE_SUPABASE_URL          [Production] [Preview] [Development]
VITE_SUPABASE_ANON_KEY      [Production] [Preview] [Development]
VITE_OPENAI_API_KEY         [Production] [Preview] [Development] (if using)
```

---

## 🚀 Your New Workflow

### For Testing/Staging:

```bash
# Switch to staging branch
git checkout staging

# Make your changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Your changes"
git push origin staging
```

**Result:** Automatically deploys to staging URL (e.g., `your-app-git-staging-yourteam.vercel.app`)

### For Production:

```bash
# Merge staging into main
git checkout main
git merge staging
git push origin main
```

**Result:** Automatically deploys to production URL (e.g., `your-app.vercel.app`)

---

## 🔍 Finding Your URLs

After deployments, you'll see:

1. **Production URL:** `your-app.vercel.app` (from `main` branch)
2. **Staging URL:** `your-app-git-staging-yourteam.vercel.app` (from `staging` branch)
3. **Preview URLs:** `your-app-git-branchname-yourteam.vercel.app` (from other branches)

You can find these in:
- Vercel Dashboard → Your Project → Deployments

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] All environment variables added to Vercel (Production, Preview, Development)
- [ ] Staging branch exists: `git branch -a | grep staging`
- [ ] Production branch set to `main` in Vercel
- [ ] Push to `staging` branch → Check Vercel dashboard for deployment
- [ ] Visit staging URL → App loads without errors
- [ ] Check browser console → No environment variable errors
- [ ] Test Supabase connection → Should work
- [ ] Test image generation (if using) → Should work

---

## 🆘 Troubleshooting

### "Supabase environment variables not set"
- **Fix:** Go to Vercel → Settings → Environment Variables
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set for all environments

### "OpenAI API key is not configured"
- **Fix:** Add `VITE_OPENAI_API_KEY` to Vercel environment variables
- Or: This is expected if you're not using OpenAI features

### Staging deployment not working
- **Fix:** Check Vercel Dashboard → Deployments → Check build logs
- Make sure environment variables are set for "Preview" environment

### Environment variables not updating
- **Fix:** After adding/updating variables, you need to **redeploy**
- Go to Vercel Dashboard → Deployments → Click "Redeploy" on latest deployment

---

## 📝 Important Notes

1. **No `.env` file needed:** All variables are in Vercel
2. **GEMINI_API_KEY:** This is stored in Supabase secrets (not Vercel), which is correct
3. **Security:** Never commit `.env` files (already in `.gitignore`)
4. **Local development:** If you need to test locally, use Vercel CLI:
   ```bash
   npm i -g vercel
   vercel env pull .env.local
   ```

---

## 🎉 You're All Set!

Once you've completed the steps above:
- ✅ No more local `.env` files
- ✅ No risk of committing secrets
- ✅ Simple deployment workflow
- ✅ Separate staging and production environments

**Next:** Push to `staging` branch and watch it deploy automatically!
