import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a coherence detection system. Analyze the given text and determine if it's a coherent question or command. Respond with a JSON object containing 'isCoherent' (boolean) and 'confidence' (0-1). Consider factors like grammar, completeness, and clarity."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ error: 'No response from coherence check' });
    }

    const result = JSON.parse(content);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Coherence check error:', error);
    return res.status(500).json({ error: 'Failed to check coherence' });
  }
} 