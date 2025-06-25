import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { getOpenAIClient, transcribeAudio } from '../../lib/openai';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const openai = getOpenAIClient();
    const fileBuffer = fs.readFileSync(file.filepath);
    const audioBlob = new Blob([fileBuffer], { type: file.mimetype || 'audio/webm' });
    const transcription = await transcribeAudio(openai, audioBlob);

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({ text: transcription });
  } catch (error) {
    console.error('Error processing audio:', error);
    return res.status(500).json({ error: 'Failed to process audio' });
  }
} 