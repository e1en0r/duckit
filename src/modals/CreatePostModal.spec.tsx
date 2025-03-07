import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalContext, ModalContextValue, ToastContext, ToastContextValue, ToastProps } from '@phork/phorkit';
import { QueryClient, QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { CreatePostResponse, CreatePostVariables, useCreatePost } from 'hooks/useCreatePost';
import { CreatePostModal } from './CreatePostModal';

vi.mock('hooks/useAuthenticate', () => ({
  useAuthenticate: vi.fn().mockReturnValue({ token: 'mockToken' }),
}));

vi.mock('hooks/useCreatePost', () => ({
  useCreatePost: vi.fn(),
}));

const mockPopModal = vi.fn();
const mockCreateNotification = vi.fn();
const mockMutateAsync = vi.fn();

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ModalContext.Provider value={{ popModal: mockPopModal } as unknown as ModalContextValue}>
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        {children}
      </ToastContext.Provider>
    </ModalContext.Provider>
  </QueryClientProvider>
);

describe('CreatePostModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreatePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as unknown as UseMutationResult<CreatePostResponse, Error, CreatePostVariables, unknown>);
  });

  it('renders the create post modal and submits the form successfully', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(<CreatePostModal />, { wrapper: Wrapper });

    const headlineInput = getByLabelText('Headline');
    const imageInput = getByLabelText('Image URL');
    const submitButton = getByRole('button', { name: 'Add Duck' });

    await user.type(headlineInput, 'New Duck');
    await user.type(imageInput, 'https://example.com/duck.jpg');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        headline: 'New Duck',
        image: 'https://example.com/duck.jpg',
      });
      expect(mockCreateNotification).toHaveBeenCalled();
      expect((mockCreateNotification.mock.calls[0][0] as { props: ToastProps }).props.level).toBe('success');
      expect(mockPopModal).toHaveBeenCalled();
    });
  });

  it('shows an error message when post creation fails', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Failed to create post'));

    const user = userEvent.setup();
    const { getByLabelText, getByRole, getByText } = render(<CreatePostModal />, { wrapper: Wrapper });

    const headlineInput = getByLabelText('Headline');
    const imageInput = getByLabelText('Image URL');
    const submitButton = getByRole('button', { name: 'Add Duck' });

    await user.type(headlineInput, 'New Duck');
    await user.type(imageInput, 'https://example.com/duck.jpg');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        headline: 'New Duck',
        image: 'https://example.com/duck.jpg',
      });
      expect(mockPopModal).not.toHaveBeenCalled();

      expect(getByText('Failed to create post')).toBeInTheDocument();
    });
  });

  it('displays an error input when the headline and image are missing', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(<CreatePostModal />, { wrapper: Wrapper });

    const headlineInput = getByLabelText('Headline');
    const imageInput = getByLabelText('Image URL');
    const submitButton = getByRole('button', { name: 'Add Duck' });

    expect(headlineInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #c6c6cc');
    expect(imageInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #c6c6cc');

    await user.click(submitButton);

    expect(headlineInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #ff3232');
    expect(imageInput.closest('label')).toHaveStyle('--formbox-input-container-border-color: #ff3232');
  });

  it('disables the submit button and shows a spinner when mutation is pending', () => {
    vi.mocked(useCreatePost).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    } as unknown as UseMutationResult<CreatePostResponse, Error, CreatePostVariables, unknown>);

    const { getByRole } = render(<CreatePostModal />, { wrapper: Wrapper });

    const submitButton = getByRole('button', { name: 'Spinner' });
    expect(submitButton).toBeDisabled();
  });

  it('closes the modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<CreatePostModal />, { wrapper: Wrapper });

    const cancelButton = getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockPopModal).toHaveBeenCalled();
  });
});
