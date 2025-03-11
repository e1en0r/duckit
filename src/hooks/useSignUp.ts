import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export interface SignUpResponse {
  token: string;
}

export interface SignUpVariables {
  email: string;
  password: string;
}

export const useSignUp = () => {
  return useMutation<SignUpResponse, Error, SignUpVariables>({
    mutationKey: ['signup'],
    mutationFn: async ({ email, password }) => {
      try {
        const response = await axios.post(
          '/signup',
          { email, password },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        return response.data as SignUpResponse;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          switch (error.status) {
            case 409: {
              const e = new Error('User already exists.');
              e.name = 'duplicate';
              throw e;
            }

            default:
              throw new Error('There was an error signing up.');
          }
        }

        throw new Error('An unexpected error occurred.');
      }
    },
  });
};
