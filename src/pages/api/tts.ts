import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
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

    console.log('TTS Request:', { textLength: text.length });

    // Generate speech using OpenAI's TTS API with Nova voice
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    if (!mp3Response) {
      console.error('TTS API returned empty response');
      return res.status(500).json({ error: 'Failed to generate speech - empty response' });
    }

    // Convert the audio buffer to base64
    const arrayBuffer = await mp3Response.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.error('TTS API returned empty audio buffer');
      return res.status(500).json({ error: 'Failed to generate speech - empty audio buffer' });
    }

    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');

    console.log('TTS Success:', { 
      audioLength: base64Audio.length,
      bufferSize: buffer.length 
    });

    res.status(200).json({ audioData: base64Audio });
  } catch (error) {
    console.error('TTS error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: errorMessage
    });
  }
} 