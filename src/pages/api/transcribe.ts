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
  console.log('[Transcribe API] Request received:', {
    method: req.method,
    headers: {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    }
  });

  if (req.method !== 'POST') {
    console.warn('[Transcribe API] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Transcribe API] Initializing formidable parser');
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB max file size
      keepExtensions: true,
      multiples: false,
    });
    
    console.log('[Transcribe API] Parsing form data');
    const [fields, files] = await form.parse(req);
    console.log('[Transcribe API] Form data parsed:', {
      fieldKeys: Object.keys(fields),
      fileKeys: Object.keys(files)
    });

    const file = files.audio?.[0];
    if (!file) {
      console.error('[Transcribe API] No audio file found in request');
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('[Transcribe API] Audio file received:', {
      filename: file.originalFilename,
      filepath: file.filepath,
      size: file.size,
      type: file.mimetype,
      lastModified: file.mtime
    });

    if (!file.mimetype?.includes('audio/')) {
      console.error('[Transcribe API] Invalid file type:', file.mimetype);
      return res.status(400).json({ error: 'Invalid file type. Must be an audio file.' });
    }

    const openai = getOpenAIClient();
    if (!openai) {
      console.error('[Transcribe API] OpenAI client not initialized');
      return res.status(500).json({ error: 'OpenAI service not available' });
    }

    console.log('[Transcribe API] Reading file from disk');
    const fileBuffer = fs.readFileSync(file.filepath);
    console.log('[Transcribe API] File read complete:', {
      bufferSize: fileBuffer.length,
      bufferType: fileBuffer.constructor.name
    });

    console.log('[Transcribe API] Creating audio blob');
    const audioBlob = new Blob([fileBuffer], { type: file.mimetype || 'audio/webm' });
    console.log('[Transcribe API] Audio blob created:', {
      size: audioBlob.size,
      type: audioBlob.type
    });

    console.log('[Transcribe API] Starting OpenAI transcription');
    const transcription = await transcribeAudio(openai, audioBlob);
    console.log('[Transcribe API] Transcription completed:', {
      textLength: transcription?.length || 0,
      text: transcription?.substring(0, 100) + '...' // Log first 100 chars
    });

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);
    console.log('[Transcribe API] Cleaned up temporary file:', file.filepath);

    return res.status(200).json({ text: transcription });
  } catch (error) {
    console.error('[Transcribe API] Error processing request:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // Clean up any temporary files in case of error
    try {
      const files = await (formidable()).parse(req);
      const file = files[1].audio?.[0];
      if (file?.filepath) {
        fs.unlinkSync(file.filepath);
        console.log('[Transcribe API] Cleaned up temporary file after error:', file.filepath);
      }
    } catch (cleanupError) {
      console.error('[Transcribe API] Error during cleanup:', cleanupError);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      error: 'Failed to process audio',
      details: errorMessage
    });
  }
} 