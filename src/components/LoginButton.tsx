import React, { cloneElement, lazy, Suspense, useCallback, useContext } from 'react';
import { ForwardProps, ModalContext } from '@phork/phorkit';
import { ModalLoader } from 'modals/ModalLoader';

const LoginModal = lazy(() => import('modals/LoginModal').then(({ LoginModal }) => ({ default: LoginModal })));

export type LoginButtonProps<E extends React.ElementType> = Partial<React.ComponentPropsWithoutRef<E>> & {
  children: React.ReactElement;
};

export const LoginButton = <E extends React.ElementType>({
  children,
  ...props
}: LoginButtonProps<E>): React.ReactElement => {
  const { createModal } = useContext(ModalContext);

  const handleClick = useCallback(() => {
    createModal(
      <ForwardProps>
        {props => (
          <Suspense fallback={<ModalLoader size="medium" />}>
            <LoginModal immediate {...props} />
          </Suspense>
        )}
      </ForwardProps>,
    );
  }, [createModal]);

  return cloneElement(children, {
    onClick: handleClick,
    ...props,
  });
};

LoginButton.displayName = 'LoginButton';
