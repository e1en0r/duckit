import { API_PROXY, USE_PROXY } from 'config/api';

export const getApiUrlWithProxy = (url?: string): string | undefined => {
  if (USE_PROXY) {
    if ('host' in API_PROXY) {
      if (API_PROXY.host && API_PROXY.protocol && API_PROXY.port) {
        return `${API_PROXY.protocol}://${API_PROXY.host}:${API_PROXY.port}${API_PROXY.path ? `/${API_PROXY.path}` : ''}${url ?? ''}`;
      } else {
        throw new Error('Invalid proxy');
      }
    }

    if ('path' in API_PROXY) {
      if (API_PROXY.path) {
        return `${API_PROXY.path}${url ?? ''}`;
      } else {
        throw new Error('Invalid proxy');
      }
    }
  }

  return url;
};
