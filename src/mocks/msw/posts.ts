import { http, HttpResponse } from 'msw';
import { CreatePostVariables, CreatePostResponse } from 'hooks/useCreatePost';
import { DuckVoteResponse } from 'hooks/useDuckVote';
import { Duck, DuckResponse } from 'types/duck';

const mockDuckPost: Duck = {
  id: 'one',
  headline: 'Mock duck',
  image: 'http://example.com/duck.jpg',
  upvotes: 3,
  author: 'Scrooge McDuck',
};

export const handlers = [
  // get the posts
  http.get<never, DuckResponse>('/posts', () => {
    return HttpResponse.json({
      Posts: [mockDuckPost, { ...mockDuckPost, id: 'two' }, { ...mockDuckPost, id: 'three' }],
    });
  }),

  // create a new post
  http.post<never, CreatePostVariables, CreatePostResponse, '/posts'>('/posts', async ({ request }) => {
    const postData = await request.json();

    if (postData.headline === 'error') {
      return HttpResponse.json(null, { status: 400 });
    }

    return HttpResponse.json({
      id: 'four',
    });
  }),

  // upvote or downvote a post
  http.post<{ postId: string; direction: 'upvote' | 'downvote' }, never, DuckVoteResponse, '/posts/:postId/:direction'>(
    '/posts/:postId/:direction',
    ({ params }) => {
      const { postId } = params;

      if (postId === '404') {
        return HttpResponse.json(null, { status: 404 });
      }
      if (postId === '403') {
        return HttpResponse.json(null, { status: 403 });
      }

      return HttpResponse.json<DuckVoteResponse>({
        upvotes: 9,
      });
    },
  ),
];
