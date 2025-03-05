import { http, HttpResponse } from 'msw';
import { SignUpVariables, SignUpResponse } from 'hooks/useSignUp';

export const handlers = [
  http.post<never, SignUpVariables, SignUpResponse, '/signup'>('/signup', async ({ request }) => {
    const postData = await request.json();

    if (postData.password === 'duplicate') {
      return new HttpResponse(null, { status: 409 });
    }

    if (postData.password === 'error') {
      throw new Error();
    }

    return HttpResponse.json({
      token: 'mockToken',
    });
  }),
];
