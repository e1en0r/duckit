import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DuckResponse } from 'types/duck';

export const FETCH_POSTS_QUERY_KEY = 'ducks';

// the API doesn't seem to have pagination so we just have a single fetch here
export const useFetchPosts = () => {
  const query = useQuery({
    queryKey: [FETCH_POSTS_QUERY_KEY],
    queryFn: async () => {
      try {
        const response = await axios.get('/posts');
        const data = response.data as DuckResponse;
        return data.Posts;
      } catch (error: unknown) {
        throw new Error('There was an error fetching the ducks.');
      }
    },
    retry: false,
  });

  return query;
};
