export const API_BASE_URL = `https://nametag-duckit-2.uc.r.appspot.com`;

export type ApiProxy =
  | {
      host: string;
      port: number;
      protocol: string;
    }
  | {
      path: string;
    };

// these are the settings for the local proxy from proxy.js
const API_PROXY_LOCAL: ApiProxy = {
  host: 'localhost',
  port: 3000,
  protocol: 'http',
};

// these are the settings for the netlify proxy
const API_PROXY_NETLIFY: ApiProxy = {
  path: '/api',
};

export const USE_PROXY = true;
export const API_PROXY = (import.meta.env.DEV ? API_PROXY_LOCAL : API_PROXY_NETLIFY) as ApiProxy;
