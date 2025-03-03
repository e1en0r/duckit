import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from 'config/api';
import { getApiUrlWithProxy } from 'utils/api';

export interface SignInResponse {
  token: string;
}

export interface SignInVariables {
  email: string;
  password: string;
}

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInVariables>({
    mutationKey: ['signin'],
    mutationFn: async ({ email, password }) => {
      try {
        const response = await axios.post(
          getApiUrlWithProxy(`${API_BASE_URL}/signin`),
          { email, password },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        return response.data as SignInResponse;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          switch (error.status) {
            case 404: {
              const e = new Error('User does not exist.');
              e.name = 'missing';
              throw e;
            }

            case 403: {
              const e = new Error('Incorrect email or password.');
              e.name = 'password';
              throw e;
            }

            default:
              throw new Error('There was an error signing in.');
          }
        }

        throw new Error('An unexpected error occurred.');
      }
    },
  });
};
