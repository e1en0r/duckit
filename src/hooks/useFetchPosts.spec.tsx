import { describe, expect, it, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../setupTests';
import { useFetchPosts } from './useFetchPosts';

vi.mock('config/api', () => ({
  USE_PROXY: false,
  API_BASE_URL: '',
}));

describe('useFetchPosts', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.ReactElement;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  });

  it('should fetch and return posts successfully', async () => {
    const { result } = renderHook(() => useFetchPosts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(3);
    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 'one' }),
      expect.objectContaining({ id: 'two' }),
      expect.objectContaining({ id: 'three' }),
    ]);
  });

  it('should handle an API error gracefully', async () => {
    server.use(http.get('/posts', () => new HttpResponse(null, { status: 500 })));

    const { result } = renderHook(() => useFetchPosts(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('There was an error fetching the ducks.');
  });
});
