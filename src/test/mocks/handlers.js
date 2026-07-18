import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'This is a mock response from Sophia.'
              }
            ]
          }
        }
      ]
    });
  }),
];
