import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ModalContext, ModalContextValue } from '@phork/phorkit';
import { LoginButton } from 'components/LoginButton';

describe('<LoginButton />', () => {
  it('should render a button', () => {
    const { getByRole } = render(
      <LoginButton>
        <button>Login</button>
      </LoginButton>,
    );

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Login');
  });

  it('should trigger a modal on click', async () => {
    const user = userEvent.setup();
    const createModal = vi.fn();

    const { getByRole } = render(
      <ModalContext.Provider value={{ createModal } as unknown as ModalContextValue}>
        <LoginButton>
          <button>Login</button>
        </LoginButton>
      </ModalContext.Provider>,
    );

    const button = getByRole('button');
    await user.click(button);

    expect(createModal).toHaveBeenCalledTimes(1);
  });
});
