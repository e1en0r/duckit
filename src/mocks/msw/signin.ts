import { http, HttpResponse } from 'msw';
import { SignInVariables, SignInResponse } from 'hooks/useSignIn';

export const handlers = [
  http.post<never, SignInVariables, SignInResponse, '/signin'>('/signin', async ({ request }) => {
    const postData = await request.json();

    if (postData.password === 'missing') {
      return new HttpResponse(null, { status: 404 });
    }

    if (postData.password === 'incorrect') {
      return new HttpResponse(null, { status: 403 });
    }

    if (postData.password === 'error') {
      throw new Error();
    }

    return HttpResponse.json({
      token: 'mockSignInToken',
    });
  }),
];
