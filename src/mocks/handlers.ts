import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock the chat API
  http.post('/api/chat', () => {
    return HttpResponse.json({
      response: 'This is a mock response',
      threadId: 'mock-thread-id'
    });
  }),

  // Mock the OpenAI API
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      id: 'mock-completion-id',
      object: 'chat.completion',
      created: Date.now(),
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'This is a mock OpenAI response'
          },
          finish_reason: 'stop',
          index: 0
        }
      ]
    });
  }),

  // Mock hotel search API
  http.get('/api/hotels/search', () => {
    return HttpResponse.json({
      hotels: [
        {
          id: 'mock-hotel-1',
          name: 'Mock Hotel 1',
          location: 'Mock Location 1'
        },
        {
          id: 'mock-hotel-2',
          name: 'Mock Hotel 2',
          location: 'Mock Location 2'
        }
      ]
    });
  })
]; 