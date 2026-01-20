# Getting a Valid Google Cloud Text-to-Speech API Key

## Issue
The provided API key (`ap2_91d4dca3-3827-48e0-b027-09768cfc854e`) is not valid for Google Cloud TTS. The error message states: "API key not valid."

## How to Get a Valid Google Cloud TTS API Key

### Step 1: Create a Google Cloud Account
1. Go to https://console.cloud.google.com
2. Sign in with your Google account
3. Accept the terms of service

### Step 2: Create a New Project
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it "Virtual Herbal Garden" or similar
4. Click "Create"

### Step 3: Enable Text-to-Speech API
1. Go to https://console.cloud.google.com/apis/library
2. Search for "Cloud Text-to-Speech API"
3. Click on it
4. Click "Enable"

### Step 4: Create API Key
1. Go to https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key (it will look like: `AIzaSy...`)
4. (Optional) Click "Restrict Key" to limit it to Text-to-Speech API only

### Step 5: Update .env File
Replace the current API key in `.env` with your new Google Cloud API key:
```
GOOGLE_CLOUD_TTS_API_KEY=AIzaSy...your_actual_key_here
```

### Step 6: Run the Script
```bash
node scripts/generate_audio.js
```

## Free Tier Limits
- **1 million characters per month** for free
- Our 35 plants use ~8,750 characters total
- **You'll use less than 1% of the free tier!**

## Alternative: Use a Different Service

If you prefer not to set up Google Cloud, here are alternatives:

### Option 1: OpenAI TTS (Easiest)
- Cost: ~$0.13 for all 35 plants
- Simple API key setup
- High quality voices

### Option 2: Generate Manually
- Use free online TTS tools
- Generate a few key plants manually
- Skip audio for less important plants

Let me know which option you'd like to pursue!
