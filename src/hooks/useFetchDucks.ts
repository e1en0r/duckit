import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from 'config/api';
import { DuckResponse } from 'types/duck';
import { getApiUrlWithProxy } from 'utils/api';

export const FETCH_DUCKS_QUERY_KEY = 'ducks';

// the API doesn't seem to have pagination so we just have a single fetch here
export const useFetchDucks = () => {
  const query = useQuery({
    queryKey: [FETCH_DUCKS_QUERY_KEY],
    queryFn: async () => {
      try {
        const response = await axios.get(getApiUrlWithProxy(`${API_BASE_URL}/posts`));
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
