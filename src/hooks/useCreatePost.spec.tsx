import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreatePost } from './useCreatePost';

vi.mock('config/api', () => ({
  USE_PROXY: false,
  API_BASE_URL: '',
}));

describe('useCreatePost', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.ReactElement;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  });

  it('should create a post successfully', async () => {
    const headline = 'Mock Headline';
    const image = 'http://example.com/image.jpg';

    const { result } = renderHook(() => useCreatePost({ token: 'mockToken' }), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync({ headline, image });
      expect(response.id).toBe('four');
    });
  });

  it('should throw an error if the token is missing', async () => {
    const post = {
      headline: 'Mock Headline',
      image: 'http://example.com/image.jpg',
    };

    const { result } = renderHook(() => useCreatePost({ token: undefined }), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(post)).rejects.toThrow('You must be logged in to create a post.');
    });
  });

  it('should throw an error if the headline or image is missing', async () => {
    const token = 'mock-token';
    const { result } = renderHook(() => useCreatePost({ token }), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ headline: '', image: 'http://example.com/image.jpg' })).rejects.toThrow(
        'Missing headline and/or image.',
      );
      await expect(result.current.mutateAsync({ headline: 'Mock Headline', image: '' })).rejects.toThrow(
        'Missing headline and/or image.',
      );
    });
  });

  it('should handle an unknown error', async () => {
    const post = {
      headline: 'error',
      image: 'http://example.com/image.jpg',
    };

    const { result } = renderHook(() => useCreatePost({ token: 'mockToken' }), { wrapper });

    await expect(result.current.mutateAsync(post)).rejects.toThrow('There was an error creating the post.');
  });
});
