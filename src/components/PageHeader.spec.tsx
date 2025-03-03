import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ModalContext, ModalContextValue } from '@phork/phorkit';
import { PageHeader } from 'components/PageHeader';
import { AuthenticationContext } from 'context/AuthenticationContext';
import { useAuthenticate, UseAuthenticateResponse } from 'hooks/useAuthenticate';

vi.mock('hooks/useAuthenticate', () => ({
  useAuthenticate: vi.fn().mockReturnValue({
    logout: vi.fn(),
  }),
}));

describe('<PageHeader />', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render a title', () => {
    const { getByText } = render(
      <AuthenticationContext.Provider value={[undefined, vi.fn()]}>
        <PageHeader />
      </AuthenticationContext.Provider>,
    );

    expect(getByText('Duckit')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('should render a login button that triggers a login modal on click', async () => {
    const user = userEvent.setup();
    const createModal = vi.fn();

    const { getByRole, getByText } = render(
      <ModalContext.Provider value={{ createModal } as unknown as ModalContextValue}>
        <AuthenticationContext.Provider value={[undefined, vi.fn()]}>
          <PageHeader />
        </AuthenticationContext.Provider>
      </ModalContext.Provider>,
    );

    expect(getByText('Login')).toBeInTheDocument();

    const button = getByRole('button');
    await user.click(button);

    expect(createModal).toHaveBeenCalledTimes(1);
  });

  it('should render a logout button that calls logout on click', async () => {
    const user = userEvent.setup();

    const logoutSpy = vi.fn();
    vi.mocked(useAuthenticate).mockReturnValue({ logout: logoutSpy } as unknown as UseAuthenticateResponse);

    const { getByRole, getByText } = render(
      <AuthenticationContext.Provider value={['mockToken', vi.fn()]}>
        <PageHeader />
      </AuthenticationContext.Provider>,
    );

    expect(getByText('Logout')).toBeInTheDocument();

    const button = getByRole('button');
    await user.click(button);

    expect(logoutSpy).toHaveBeenCalled();
  });
});
