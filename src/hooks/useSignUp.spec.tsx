import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSignUp } from './useSignUp';

vi.mock('config/api', () => ({
  USE_PROXY: false,
  API_BASE_URL: '',
}));

describe('useSignUp', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.ReactElement;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  });

  it('should sign up user successfully', async () => {
    const email = 'test@example.com';
    const password = 'password';

    const { result } = renderHook(() => useSignUp(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync({ email, password });
      expect(response.token).toBe('mockSignUpToken');
    });
  });

  it('should handle a 409 error', async () => {
    const email = 'test@example.com';
    const password = 'duplicate';

    const { result } = renderHook(() => useSignUp(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ email, password })).rejects.toThrow('User already exists.');
    });
  });

  it('should handle a default error', async () => {
    const email = 'test@example.com';
    const password = 'error';

    const { result } = renderHook(() => useSignUp(), { wrapper });

    await expect(result.current.mutateAsync({ email, password })).rejects.toThrow('There was an error signing up.');
  });
});
