import { useContext } from 'react';
import { AuthenticationContext } from 'context/AuthenticationContext';

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};
