import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi } from 'vitest';
import { useAuthenticate, UseAuthenticateResponse } from 'hooks/useAuthenticate';
import { LogoutButton } from './LogoutButton';

vi.mock('hooks/useAuthenticate', () => ({
  useAuthenticate: vi.fn().mockReturnValue({}),
}));

describe('LogoutButton', () => {
  it('should render a button', () => {
    const { getByRole } = render(
      <LogoutButton>
        <button>Logout</button>
      </LogoutButton>,
    );

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Logout');
  });

  it('should trigger the logout on click', async () => {
    const user = userEvent.setup();
    const mockLogout = vi.fn();

    vi.mocked(useAuthenticate).mockReturnValue({
      token: 'mockToken',
      logout: mockLogout,
    } as unknown as UseAuthenticateResponse);

    render(
      <LogoutButton>
        <button>Logout</button>
      </LogoutButton>,
    );

    const button = screen.getByText('Logout');
    await user.click(button);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
