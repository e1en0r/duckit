import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from 'config/authentication';
import { AuthenticationContext } from './AuthenticationContext';

export interface AuthenticationProps {
  children: React.ReactNode;
}

export function AuthenticationProvider({ children }: AuthenticationProps): React.ReactElement {
  const value = useState<string | undefined>(Cookies.get(AUTH_COOKIE_NAME));

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
}

AuthenticationProvider.displayName = 'AuthenticationProvider';
