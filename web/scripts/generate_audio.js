import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Default: Adam voice

// Paths
const SUMMARIES_PATH = path.join(__dirname, 'plant_summaries.json');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateAudio(plantId, text) {
    console.log(`Generating audio for: ${plantId}`);

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const outputPath = path.join(OUTPUT_DIR, `${plantId}.mp3`);

    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    console.log(`✓ Saved: ${plantId}.mp3`);

    return outputPath;
}

async function main() {
    if (!ELEVENLABS_API_KEY) {
        console.error('Error: ELEVENLABS_API_KEY not found in environment variables');
        console.log('Please add ELEVENLABS_API_KEY to your .env file');
        process.exit(1);
    }

    // Read plant summaries
    const summaries = JSON.parse(fs.readFileSync(SUMMARIES_PATH, 'utf-8'));

    const manifest = {};
    const plantIds = Object.keys(summaries);

    console.log(`\nGenerating audio for ${plantIds.length} plants...\n`);

    for (const plantId of plantIds) {
        try {
            const text = summaries[plantId];
            await generateAudio(plantId, text);

            manifest[plantId] = {
                audioFile: `/assets/audio/${plantId}.mp3`,
                script: text,
                generatedAt: new Date().toISOString()
            };

            // Rate limiting: wait 1 second between requests
            await new Promise(resolve => setTimeout(resolve, 1000));

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
