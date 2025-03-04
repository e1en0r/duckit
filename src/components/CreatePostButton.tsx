import React, { cloneElement, lazy, Suspense, useCallback, useContext } from 'react';
import { ForwardProps, ModalContext } from '@phork/phorkit';
import { ModalLoader } from 'modals/ModalLoader';

const CreatePostModal = lazy(() =>
  import('modals/CreatePostModal').then(({ CreatePostModal }) => ({ default: CreatePostModal })),
);

export type CreatePostButtonProps<E extends React.ElementType> = Partial<React.ComponentPropsWithoutRef<E>> & {
  children: React.ReactElement;
};

export const CreatePostButton = <E extends React.ElementType>({
  children,
  ...props
}: CreatePostButtonProps<E>): React.ReactElement => {
  const { createModal } = useContext(ModalContext);

  const handleClick = useCallback(() => {
    createModal(
      <ForwardProps>
        {props => (
          <Suspense fallback={<ModalLoader size="medium" />}>
            <CreatePostModal immediate {...props} />
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

CreatePostButton.displayName = 'CreatePostButton';
