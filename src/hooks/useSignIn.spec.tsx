import {  beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSignIn } from './useSignIn';

vi.mock('config/api', () => ({
  USE_PROXY: false,
  API_BASE_URL: ''
}));

describe('useSignIn', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.ReactElement;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  });
  
  it('should sign up user successfully', async () => {
    const email = 'test@example.com';
    const password = 'password';

    const { result } = renderHook(() => useSignIn(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync({ email, password });
      expect(response.token).toBe('mockSignInToken');
    });
  });

  it('should handle a 404 error', async () => {
    const email = 'test@example.com';
    const password = 'missing';

    const { result } = renderHook(() => useSignIn(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ email, password })).rejects.toThrow('User does not exist.');
    });
  });

  it('should handle a 403 error', async () => {
    const email = 'test@example.com';
    const password = 'incorrect';

    const { result } = renderHook(() => useSignIn(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ email, password })).rejects.toThrow('Incorrect email or password.');
    });
  });


  it('should handle an unknown error', async () => {
    const email = 'test@example.com';
    const password = 'error';

    const { result } = renderHook(() => useSignIn(), { wrapper });

    await expect(result.current.mutateAsync({ email, password })).rejects.toThrow('There was an error signing in.');
  });
});
