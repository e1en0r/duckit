import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface UseCreatePostProps {
  token?: string;
}

export interface CreatePostVariables {
  headline: string;
  image: string;
}

export interface CreatePostResponse {
  id: string;
}

export const useCreatePost = ({ token }: UseCreatePostProps) => {
  return useMutation<CreatePostResponse, Error, CreatePostVariables>({
    mutationKey: ['create-post'],
    mutationFn: async ({ headline, image }) => {
      if (!token) {
        throw new Error('You must be logged in to create a post.');
      }

      if (!headline || !image) {
        throw new Error('Missing headline and/or image.');
      }

      try {
        const response = await axios.post(
          '/posts',
          { headline, image },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        return response.data as CreatePostResponse;
      } catch (error: unknown) {
        throw new Error('There was an error creating the post.');
      }
    },
  });
};
