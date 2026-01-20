# Audio Generation Setup Instructions

## Prerequisites
- Node.js installed
- ElevenLabs API account (https://elevenlabs.io)

## Steps to Generate Audio Files

### 1. Get ElevenLabs API Key
1. Sign up at https://elevenlabs.io
2. Go to your profile settings
3. Copy your API key

### 2. Add API Key to Environment
Add the following to your `.env` file in the `/web` directory:

```
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

**Available Voice IDs:**
- `pNInz6obpgDQGcFmaJgB` - Adam (default, professional male voice)
- `EXAVITQu4vr4xnSDxMaL` - Bella (warm female voice)
- `21m00Tcm4TlvDq8ikWAM` - Rachel (calm female voice)
- `AZnzlk1XvdvUeBnXmlld` - Domi (strong male voice)

### 3. Install Dependencies
```bash
cd /Users/pruthv/Desktop/CTRL-ALT-DEFEAT/web
npm install dotenv
```

### 4. Run the Audio Generation Script
```bash
node scripts/generate_audio.js
```

This will:
- Read all plant summaries from `scripts/plant_summaries.json`
- Generate MP3 files for each plant using ElevenLabs TTS
- Save audio files to `public/assets/audio/`
- Create an audio manifest file

### 5. Verify Audio Files
Check that audio files were created:
```bash
ls -lh public/assets/audio/
```

You should see 35 MP3 files (one for each plant).

## Cost Estimate
- ElevenLabs free tier: 10,000 characters/month
- Each summary: ~200-300 characters
- Total for 35 plants: ~8,750 characters
- **This should fit within the free tier!**

## Troubleshooting

### Error: "ELEVENLABS_API_KEY not found"
- Make sure you added the API key to `.env` file
- Restart the script after adding the key

### Error: "Rate limit exceeded"
- The script includes 1-second delays between requests
- If you still hit limits, increase the delay in `generate_audio.js`

### Audio files not loading in browser
- Make sure files are in `public/assets/audio/` directory
- Check browser console for 404 errors
- Verify file names match plant IDs (e.g., `aloe_vera.mp3`)

## Testing
After generating audio files, navigate to any plant detail page and click the play button to test the audio player.
