import { describe, it, expect, vi } from 'vitest';

vi.mock('config/api', async () => {
  const actual = await vi.importActual<typeof import('config/api')>('config/api');
  return {
    ...actual,
    USE_PROXY: false,
    API_PROXY: undefined,
  };
});

describe('getApiUrlWithProxy', () => {
  it('should return the URL as is when USE_PROXY is false', async () => {
    vi.doMock('config/api', async () => {
      const actual = await vi.importActual<typeof import('config/api')>('config/api');
      return {
        ...actual,
        USE_PROXY: false,
        API_PROXY: undefined,
      };
    });

    vi.resetModules();
    const { getApiUrlWithProxy } = await import('./api');

    expect(getApiUrlWithProxy('/test')).toBe('/test');
  });

  it('should return the correct API URL with local proxy when USE_PROXY is true and API_PROXY_LOCAL is used', async () => {
    vi.doMock('config/api', async () => {
      const actual = await vi.importActual<typeof import('config/api')>('config/api');
      return {
        ...actual,
        USE_PROXY: true,
        API_PROXY: actual.API_PROXY_LOCAL,
      };
    });

    vi.resetModules();
    const { getApiUrlWithProxy } = await import('./api');

    expect(getApiUrlWithProxy('/test')).toBe('http://localhost:3000/https://nametag-duckit-2.uc.r.appspot.com/test');
  });

  it('should return the correct API URL with Netlify proxy when USE_PROXY is true and API_PROXY_NETLIFY is used', async () => {
    vi.doMock('config/api', async () => {
      const actual = await vi.importActual<typeof import('config/api')>('config/api');
      return {
        ...actual,
        USE_PROXY: true,
        API_PROXY: actual.API_PROXY_NETLIFY,
      };
    });

    vi.resetModules();
    const { getApiUrlWithProxy } = await import('./api');

    expect(getApiUrlWithProxy('/test')).toBe('/api/test');
  });

  it('should return only the local proxy URL when no path is provided', async () => {
    vi.doMock('config/api', async () => {
      const actual = await vi.importActual<typeof import('config/api')>('config/api');
      return {
        ...actual,
        USE_PROXY: true,
        API_PROXY: actual.API_PROXY_LOCAL,
      };
    });

    vi.resetModules();
    const { getApiUrlWithProxy } = await import('./api');

    expect(getApiUrlWithProxy()).toBe('http://localhost:3000/https://nametag-duckit-2.uc.r.appspot.com');
  });

  it('should return only the Netlify API path when no URL is provided', async () => {
    vi.doMock('config/api', async () => {
      const actual = await vi.importActual<typeof import('config/api')>('config/api');
      return {
        ...actual,
        USE_PROXY: true,
        API_PROXY: actual.API_PROXY_NETLIFY,
      };
    });

    vi.resetModules();
    const { getApiUrlWithProxy } = await import('./api');

    expect(getApiUrlWithProxy()).toBe('/api');
  });

  it('should throw an error when API_PROXY is missing required fields (host, protocol, port)', async () => {
    vi.doMock('config/api', () => {
      return {
        USE_PROXY: true,
        API_PROXY: { host: 'localhost' },
      };
    });

    vi.resetModules();
    const { getApiUrlWithProxy } = await import('./api');

    expect(() => getApiUrlWithProxy('/test')).toThrowError('Invalid proxy');
  });

  it('should throw an error when API_PROXY has an invalid path', async () => {
    vi.doMock('config/api', () => {
      return {
        USE_PROXY: true,
        API_PROXY: { path: '' },
      };
    });

    vi.resetModules();
    const { getApiUrlWithProxy } = await import('./api');

    expect(() => getApiUrlWithProxy('/test')).toThrowError('Invalid proxy');
  });
});
