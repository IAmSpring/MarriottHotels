import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  
  try {
    const [fields, files] = await form.parse(req);
    const audioFile = files.audio?.[0];

    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFile.filepath),
      model: 'whisper-1',
    });

    fs.unlinkSync(audioFile.filepath);
    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
} 