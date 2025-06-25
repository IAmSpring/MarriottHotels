import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Generate speech using OpenAI's TTS API with Nova voice
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    // Convert the audio buffer to base64
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    res.status(200).json({ audioData: base64Audio });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
} 