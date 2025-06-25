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
    const formData = req.body;
    if (!formData || !formData.audio) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const response = await openai.audio.transcriptions.create({
      file: formData.audio,
      model: 'whisper-1',
    });

    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
} 