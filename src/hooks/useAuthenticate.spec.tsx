import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useAuthenticationContext } from 'context/useAuthenticationContext';
import { useAuthenticate } from './useAuthenticate';

vi.mock('config/api', () => ({
  USE_PROXY: false,
  API_BASE_URL: '',
}));

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('context/useAuthenticationContext', () => ({
  useAuthenticationContext: vi.fn(),
}));

describe('useAuthenticate', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.ReactElement;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

    vi.mocked(useAuthenticationContext).mockReturnValue([undefined, vi.fn()]);
  });

  it('should authenticate user with sign-in successfully', async () => {
    const email = 'test@example.com';
    const password = 'password';

    const { result } = renderHook(() => useAuthenticate(), { wrapper });

    await act(async () => {
      const response = await result.current.authenticate({ email, password });
      expect(response.token).toBe('mockSignInToken');
    });
  });

  it('should fall back to sign-up if sign-in fails with a 404 error', async () => {
    const email = 'test@example.com';
    const password = 'missing';

    const { result } = renderHook(() => useAuthenticate(), { wrapper });

    await act(async () => {
      const response = await result.current.authenticate({ email, password });
      expect(response.token).toBe('mockSignUpToken');
    });
  });

  it('should handle an unknown error', async () => {
    const email = 'test@example.com';
    const password = 'error';

    const { result } = renderHook(() => useAuthenticate(), { wrapper });

    await expect(result.current.authenticate({ email, password })).rejects.toThrow('There was an error signing in.');
  });

  it('should persist the token and store it in a cookie', () => {
    const token = 'mockToken';
    const { result } = renderHook(() => useAuthenticate(), { wrapper });

    result.current.persist(token);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Cookies.set).toHaveBeenCalledWith('access-token', token, { sameSite: 'strict' });
  });

  it('should log out by clearing token and removing cookie', () => {
    const { result } = renderHook(() => useAuthenticate(), { wrapper });

    result.current.logout();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Cookies.remove).toHaveBeenCalledWith('access-token');
  });
});
