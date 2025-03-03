import { API_PROXY_HOST, API_PROXY_PORT, API_PROXY_PROTOCOL, USE_PROXY } from 'config/api';

export const getApiUrlWithProxy = (url: string): string =>
  USE_PROXY ? `${API_PROXY_PROTOCOL}://${API_PROXY_HOST}:${API_PROXY_PORT}/${url}` : url;
