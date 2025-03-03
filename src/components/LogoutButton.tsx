import React, { cloneElement, useCallback } from 'react';
import { useAuthenticate } from 'hooks/useAuthenticate';

export type LogoutButtonProps<E extends React.ElementType> = Partial<React.ComponentPropsWithoutRef<E>> & {
  children: React.ReactElement;
};

export const LogoutButton = <E extends React.ElementType>({
  children,
  ...props
}: LogoutButtonProps<E>): React.ReactElement => {
  const { logout } = useAuthenticate();

  const handleClick = useCallback(() => {
    logout();
  }, [logout]);

  return cloneElement(children, {
    onClick: handleClick,
    ...props,
  });
};

LogoutButton.displayName = 'LogoutButton';
