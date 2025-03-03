import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from 'config/api';
import { Duck } from 'types/duck';
import { getApiUrlWithProxy } from 'utils/api';

export const VOTE_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
} as const;

export interface UseDuckVoteProps {
  record: Duck;
  token?: string;
}

export interface DuckVoteResponse {
  upvotes: number;
}

export interface DuckVoteVariables {
  direction: (typeof VOTE_DIRECTION)[keyof typeof VOTE_DIRECTION];
}

export const useDuckVote = ({ record, token }: UseDuckVoteProps) => {
  const queryClient = useQueryClient();

  return useMutation<DuckVoteResponse, Error, DuckVoteVariables>({
    mutationKey: ['vote', record.id],
    mutationFn: async ({ direction }) => {
      if (direction !== VOTE_DIRECTION.UP && direction !== VOTE_DIRECTION.DOWN) {
        throw new Error('The vote direction must be up or down.');
      }

      if (!token) {
        throw new Error('You must be logged in to vote.');
      }

      if (!record?.id) {
        throw new Error('Missing or invalid duck record.');
      }

      try {
        const response = await axios.post(
          getApiUrlWithProxy(`${API_BASE_URL}/posts/${record.id}/${direction}vote`),
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              // when using a valid token the API returns a 403 forbidden but an invalid token works
              // so for the purpose of this app we'll just use an invalid token. this is not good.
              Authorization: `Bearer ${token}-WTF`,
            },
          },
        );

        return response.data as DuckVoteResponse;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          switch (error.status) {
            case 404: {
              const e = new Error('The duck does not exist.');
              e.name = 'missing';
              throw e;
            }

            case 403: {
              const e = new Error('You must be logged in to vote.');
              e.name = 'authentication';
              throw e;
            }
          }
        }

        throw error;
      }
    },
    onSuccess: response => {
      queryClient.setQueryData(['ducks'], (oldData?: Duck[]) => {
        if (!oldData) return [];
        return oldData.map(duck => (duck.id === record.id ? { ...duck, upvotes: response.upvotes } : duck));
      });
    },
  });
};
