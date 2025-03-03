import { useCallback } from 'react';
import Cookies from 'js-cookie';
import { useSignIn, SignInResponse } from 'hooks/useSignIn';
import { SignUpResponse, useSignUp } from 'hooks/useSignUp';
import { AUTH_COOKIE_NAME } from 'config/authentication';
import { useAuthenticationContext } from 'context/useAuthenticationContext';

export interface UseAuthenticateProps {
  email: string;
  password: string;
}

export interface UseAuthenticateResponse {
  authenticate: (props: { email: string; password: string }) => Promise<SignInResponse | SignUpResponse>;
  isAuthenticating: boolean;
  logout: () => void;
  persist: (token: string) => void;
  token: string | undefined;
}

export const useAuthenticate = (): UseAuthenticateResponse => {
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();

  const [token, setToken] = useAuthenticationContext();

  const authenticate = useCallback<UseAuthenticateResponse['authenticate']>(
    async ({ email, password }) => {
      try {
        // if the sign in was successful then return the auth token
        return await signInMutation.mutateAsync({ email, password });
      } catch (error: unknown) {
        if (error instanceof Error) {
          // if the sign in returned a 404 page then register the user and return the auth token
          if (error.name === 'missing') {
            return await signUpMutation.mutateAsync({ email, password });
          }
        }
        throw error;
      }
    },
    [signInMutation, signUpMutation],
  );

  const persist = useCallback<UseAuthenticateResponse['persist']>(
    token => {
      setToken(token);
      Cookies.set(AUTH_COOKIE_NAME, token);
    },
    [setToken],
  );

  const logout = useCallback(() => {
    setToken(undefined);
    Cookies.remove(AUTH_COOKIE_NAME);
  }, [setToken]);

  return {
    authenticate,
    isAuthenticating: signInMutation.isPending || signUpMutation.isPending,
    logout,
    persist,
    token,
  };
};
