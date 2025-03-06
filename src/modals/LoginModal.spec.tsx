import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalContext, ModalContextValue } from '@phork/phorkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { useAuthenticate, UseAuthenticateResponse } from 'hooks/useAuthenticate';
import { LoginModal } from './LoginModal';

vi.mock('hooks/useAuthenticate', () => ({
  useAuthenticate: vi.fn(),
}));

const mockPopModal = vi.fn();
const mockAuthenticate = vi.fn();
const mockPersist = vi.fn();

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ModalContext.Provider value={{ popModal: mockPopModal } as unknown as ModalContextValue}>
      {children}
    </ModalContext.Provider>
  </QueryClientProvider>
);

describe('LoginModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockAuthenticate.mockResolvedValue({ token: 'mockToken' });

    vi.mocked(useAuthenticate).mockReturnValue({
      authenticate: mockAuthenticate.mockResolvedValue({ token: 'mockToken' }),
      persist: mockPersist,
    } as unknown as UseAuthenticateResponse);
  });

  it('renders LoginModal and submits form successfully', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(<LoginModal />, { wrapper: Wrapper });

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByRole('button', { name: 'Login' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(mockPopModal).toHaveBeenCalled();
      expect(mockPersist).toHaveBeenCalledWith('mockToken');
    });
  });

  it('shows an error message when authentication fails', async () => {
    mockAuthenticate.mockRejectedValueOnce(new Error('Invalid credentials'));

    const user = userEvent.setup();
    const { getByLabelText, getByRole, getByText } = render(<LoginModal />, { wrapper: Wrapper });

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByRole('button', { name: 'Login' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(mockPopModal).not.toHaveBeenCalled();
      expect(mockPersist).not.toHaveBeenCalled();

      expect(getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('displays an error input when the username and password are missing', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(<LoginModal />, { wrapper: Wrapper });

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByRole('button', { name: 'Login' });

    expect(emailInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #c6c6cc');
    expect(passwordInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #c6c6cc');

    await user.click(submitButton);

    expect(emailInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #ff3232');
    expect(passwordInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #ff3232');
  });

  it('disables the submit button and shows a spinner when authentication is in progress', () => {
    vi.mocked(useAuthenticate).mockReturnValue({
      authenticate: mockAuthenticate,
      isAuthenticating: true,
      persist: vi.fn(),
    } as unknown as UseAuthenticateResponse);

    const { getByRole } = render(<LoginModal />, { wrapper: Wrapper });

    const submitButton = getByRole('button', { name: 'Spinner' });

    expect(submitButton).toBeDisabled();
  });

  it('closes the modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<LoginModal />, { wrapper: Wrapper });

    const cancelButton = getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockPopModal).toHaveBeenCalled();
  });
});
