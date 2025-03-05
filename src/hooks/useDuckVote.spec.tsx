import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Duck } from 'types/duck';
import { useDuckVote, VOTE_DIRECTION } from './useDuckVote';

vi.mock('config/api', () => ({
  USE_PROXY: false,
  API_BASE_URL: '',
}));

const mockDuckPost: Duck = {
  id: 'one',
  headline: 'Mock duck',
  image: 'http://example.com/duck.jpg',
  upvotes: 3,
  author: 'Scrooge McDuck',
};

describe('useDuckVote', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.ReactElement;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  });

  it('should upvote the post successfully', async () => {
    const { result } = renderHook(() => useDuckVote({ record: mockDuckPost, token: 'mockToken' }), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync({ direction: VOTE_DIRECTION.UP });
      expect(response.upvotes).toBe(9);
    });
  });

  it('should downvote the post successfully', async () => {
    const { result } = renderHook(() => useDuckVote({ record: mockDuckPost, token: 'mockToken' }), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync({ direction: VOTE_DIRECTION.DOWN });
      expect(response.upvotes).toBe(9);
    });
  });

  it('should throw an error if the token is missing', async () => {
    const { result } = renderHook(() => useDuckVote({ record: mockDuckPost, token: undefined }), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ direction: VOTE_DIRECTION.UP })).rejects.toThrow(
        'You must be logged in to vote.',
      );
    });
  });

  it('should throw an error if the record is missing', async () => {
    const { result } = renderHook(() => useDuckVote({ record: {} as Duck, token: 'mockToken' }), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ direction: VOTE_DIRECTION.UP })).rejects.toThrow(
        'Missing or invalid duck record.',
      );
    });
  });

  it('should handle a 404 error', async () => {
    const { result } = renderHook(() => useDuckVote({ record: { ...mockDuckPost, id: '404' }, token: 'mockToken' }), {
      wrapper,
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ direction: VOTE_DIRECTION.UP })).rejects.toThrow(
        'The duck does not exist.',
      );
    });
  });

  it('should handle a 403 error', async () => {
    const { result } = renderHook(() => useDuckVote({ record: { ...mockDuckPost, id: '403' }, token: 'mockToken' }), {
      wrapper,
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ direction: VOTE_DIRECTION.UP })).rejects.toThrow(
        'You must be logged in to vote.',
      );
    });
  });
});
