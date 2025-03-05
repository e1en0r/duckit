import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastContext, ToastContextValue, ToastProps } from '@phork/phorkit';
import { UseMutationResult } from '@tanstack/react-query';
import { DuckVoteResponse, DuckVoteVariables, useDuckVote } from 'hooks/useDuckVote';
import { Duck } from 'types/duck';
import { useAuthenticate, UseAuthenticateResponse } from 'hooks/useAuthenticate';
import { DuckVote } from './DuckVote';

vi.mock('hooks/useDuckVote', () => ({
  VOTE_DIRECTION: {
    UP: 'up',
    DOWN: 'down',
  },
  useDuckVote: vi.fn(),
}));

vi.mock('hooks/useAuthenticate', () => ({
  useAuthenticate: vi.fn(),
}));

const mockCreateNotification = vi.fn();

describe('DuckVote', () => {
  const mockDuck: Duck = {
    headline: 'Test Duck',
    upvotes: 10,
    image: 'https://example.com/duck.jpg',
    id: 'abc',
    author: 'Mock Author',
  };

  const mockToken = 'mockToken';
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.mocked(useDuckVote).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as unknown as UseMutationResult<DuckVoteResponse, Error, DuckVoteVariables, unknown>);

    vi.mocked(useAuthenticate).mockReturnValue({
      token: mockToken,
    } as unknown as UseAuthenticateResponse);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render the upvote and downvote buttons', () => {
    const { getByTitle } = render(
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        <DuckVote record={mockDuck} />
      </ToastContext.Provider>,
    );

    expect(getByTitle('Down arrow')).toBeInTheDocument();
    expect(getByTitle('Up arrow')).toBeInTheDocument();

    expect(getByTitle('Downvote duck')).toBeInTheDocument();
    expect(getByTitle('Upvote duck')).toBeInTheDocument();
  });

  it('should call the vote function on upvote and updates the upvotes optimistically', () => {
    const { getByText, getByTitle } = render(
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        <DuckVote record={mockDuck} />
      </ToastContext.Provider>,
    );

    const upvoteButton = getByTitle('Upvote duck');
    fireEvent.click(upvoteButton);

    expect(getByText('11')).toBeInTheDocument();
    expect(mockMutateAsync).toHaveBeenCalledWith({ direction: 'up' });
  });

  it('should call vote function on downvote and updates the upvotes optimistically', () => {
    const { getByText, getByTitle } = render(
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        <DuckVote record={mockDuck} />
      </ToastContext.Provider>,
    );

    const downvoteButton = getByTitle('Downvote duck');
    fireEvent.click(downvoteButton);

    expect(getByText('9')).toBeInTheDocument();
    expect(mockMutateAsync).toHaveBeenCalledWith({ direction: 'down' });
  });

  it('should show a disabled button while the mutation is pending', () => {
    vi.mocked(useDuckVote).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    } as unknown as UseMutationResult<DuckVoteResponse, Error, DuckVoteVariables, unknown>);

    const { getByTitle } = render(
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        <DuckVote record={mockDuck} />
      </ToastContext.Provider>,
    );

    expect(getByTitle('Downvote duck')).toHaveAttribute('disabled');
    expect(getByTitle('Upvote duck')).toHaveAttribute('disabled');
  });

  it('should remove the optimistic upvote on failure', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network Error'));

    const { getByTitle } = render(
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        <DuckVote record={mockDuck} />
      </ToastContext.Provider>,
    );

    const upvoteButton = getByTitle('Upvote duck');
    fireEvent.click(upvoteButton);

    expect(screen.getByText('11')).toBeInTheDocument();

    await waitFor(() => expect(mockCreateNotification).toHaveBeenCalled());

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should display a toast notification if voting fails', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network Error'));

    const { getByTitle } = render(
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        <DuckVote record={mockDuck} />
      </ToastContext.Provider>,
    );

    const upvoteButton = getByTitle('Upvote duck');
    fireEvent.click(upvoteButton);

    await waitFor(() => expect(mockCreateNotification).toHaveBeenCalled());

    expect((mockCreateNotification.mock.calls[0][0] as { props: ToastProps }).props.level).toBe('danger');
  });

  it('should not allow voting without a token', () => {
    vi.mocked(useAuthenticate).mockReturnValue({
      token: null,
    } as unknown as UseAuthenticateResponse);

    const { getByTitle } = render(
      <ToastContext.Provider value={{ createNotification: mockCreateNotification } as unknown as ToastContextValue}>
        <DuckVote record={mockDuck} />
      </ToastContext.Provider>,
    );

    expect(getByTitle('Downvote duck')).toHaveAttribute('disabled');
    expect(getByTitle('Upvote duck')).toHaveAttribute('disabled');
  });
});
