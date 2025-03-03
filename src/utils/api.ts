import { API_PROXY, USE_PROXY } from 'config/api';

export const getApiUrlWithProxy = (url: string): string => {
  if (USE_PROXY) {
    if ('host' in API_PROXY) {
      if (API_PROXY.host && API_PROXY.protocol && API_PROXY.port) {
        return `${API_PROXY.protocol}://${API_PROXY.host}:${API_PROXY.port}/${url}`;
      } else {
        throw new Error('Invalid proxy');
      }
    }

    if ('path' in API_PROXY) {
      if (API_PROXY.path) {
        const match = /^https?:\/\/(?:[^/]+\/)?(.*)$/.exec(url);
        if (match?.[1]) {
          return `${API_PROXY.path}/${match[1]}`;
        } else {
          throw new Error('Invalid API URL');
        }
      } else {
        throw new Error('Invalid proxy');
      }
    }
  }

  return url;
};
