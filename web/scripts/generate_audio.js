import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_TTS_API_KEY;

// Paths
const SUMMARIES_PATH = path.join(__dirname, 'plant_summaries.json');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateAudio(plantId, text) {
    console.log(`Generating audio for: ${plantId}`);

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;

    const requestBody = {
        input: { text: text },
        voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-J', // Male voice, professional tone
            ssmlGender: 'MALE'
        },
        audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.95,
            pitch: 0.0
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google Cloud TTS API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    if (!result.audioContent) {
        throw new Error('No audio content in response');
    }

    // Decode base64 audio content
    const audioBuffer = Buffer.from(result.audioContent, 'base64');
    const outputPath = path.join(OUTPUT_DIR, `${plantId}.mp3`);

    fs.writeFileSync(outputPath, audioBuffer);
    console.log(`✓ Saved: ${plantId}.mp3`);

    return outputPath;
}

async function main() {
    if (!GOOGLE_API_KEY) {
        console.error('Error: GOOGLE_CLOUD_TTS_API_KEY not found in environment variables');
        console.log('Please add GOOGLE_CLOUD_TTS_API_KEY to your .env file');
        process.exit(1);
    }

    // Read plant summaries
    const summaries = JSON.parse(fs.readFileSync(SUMMARIES_PATH, 'utf-8'));

    const manifest = {};
    const plantIds = Object.keys(summaries);

    console.log(`\nGenerating audio for ${plantIds.length} plants using Google Cloud TTS...\n`);

    for (const plantId of plantIds) {
        try {
            const text = summaries[plantId];
            await generateAudio(plantId, text);

            manifest[plantId] = {
                audioFile: `/assets/audio/${plantId}.mp3`,
                script: text,
                generatedAt: new Date().toISOString(),
                service: 'Google Cloud TTS'
            };

            // Rate limiting: wait 500ms between requests
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`✗ Failed to generate audio for ${plantId}:`, error.message);
            manifest[plantId] = {
                error: error.message,
                script: summaries[plantId]
            };
        }
    }

    // Save manifest
    const manifestPath = path.join(OUTPUT_DIR, 'audio_manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`\n✓ Audio generation complete!`);
    console.log(`✓ Manifest saved to: ${manifestPath}`);
    console.log(`\nGenerated ${Object.keys(manifest).filter(k => manifest[k].audioFile).length}/${plantIds.length} audio files`);
}

main().catch(console.error);
