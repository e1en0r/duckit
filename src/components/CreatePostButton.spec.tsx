import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ModalContext, ModalContextValue } from '@phork/phorkit';
import { CreatePostButton } from './CreatePostButton';

describe('CreatePostButton', () => {
  it('should render a button', () => {
    const { getByRole } = render(
      <CreatePostButton>
        <button>Create Post</button>
      </CreatePostButton>,
    );

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Create Post');
  });

  it('should trigger a modal creation on click', async () => {
    const user = userEvent.setup();
    const createModal = vi.fn();

    const { getByRole } = render(
      <ModalContext.Provider value={{ createModal } as unknown as ModalContextValue}>
        <CreatePostButton>
          <button>Create Post</button>
        </CreatePostButton>
      </ModalContext.Provider>,
    );

    const button = getByRole('button');
    await user.click(button);

    expect(createModal).toHaveBeenCalledTimes(1);
  });
});
