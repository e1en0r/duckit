import { createContext } from 'react';

export type AuthenticationContextValue = [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];

export const AuthenticationContext = createContext<AuthenticationContextValue>({} as AuthenticationContextValue);
