import { NextApiRequest, NextApiResponse } from 'next';
import { NavigationAction } from '../../contexts/NavigationContext';

interface NavigationRequest {
  userQuery: string;
  currentUrl: string;
  screenshot?: string;
}

interface NavigationResponse {
  actions: NavigationAction[];
  explanation: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NavigationResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userQuery, currentUrl, screenshot } = req.body as NavigationRequest;

    // Here you would integrate with your AI service to generate navigation actions
    // This is a placeholder example
    const actions: NavigationAction[] = [
      {
        type: 'click',
        selector: '#login-button',
        delay: 1000,
      },
      {
        type: 'input',
        selector: '#username',
        value: 'example@email.com',
        delay: 500,
      },
      {
        type: 'input',
        selector: '#password',
        value: 'password123',
        delay: 500,
      },
      {
        type: 'click',
        selector: '#submit-button',
        delay: 1000,
      },
    ];

    const explanation = 'I will help you log in by filling out the form and submitting it.';

    // You would typically send the screenshot to your AI service here if needed
    if (screenshot) {
      // Process screenshot with AI service
      console.log('Screenshot received, length:', screenshot.length);
    }

    return res.status(200).json({
      actions,
      explanation,
    });
  } catch (error) {
    console.error('Navigation API error:', error);
    return res.status(500).json({
      error: 'Failed to process navigation request',
    });
  }
} 