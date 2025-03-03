import {
  ArrowDownIcon,
  ArrowUpIcon,
  Flex,
  IconButton,
  Rhythm,
  SpinnerIcon,
  Toast,
  ToastContext,
  Typography,
} from '@phork/phorkit';
import { useCallback, useContext, useState } from 'react';
import { useAuthenticate } from 'hooks/useAuthenticate';
import { Duck } from 'types/duck';
import { VOTE_DIRECTION, useDuckVote, DuckVoteVariables } from 'hooks/useDuckVote';

export interface DuckVoteProps {
  record: Duck;
}

/**
 * Please note: This allows someone to vote multiple times. The backend
 * doesn't prevent it so there's no reason the front end should.
 *
 * I also chose to do an optimistic upvote with a simple disabling
 * of the buttons when something is pending. There are more complex
 * ways this can be handled (eg. to allow someone to spam the buttons
 * we can use local state and debounce) but since the directions don't
 * specify I went with the simplest solution.
 */

export const DuckVote = ({ record }: DuckVoteProps): React.ReactElement => {
  const { token } = useAuthenticate();
  const duckVoteMutation = useDuckVote({ record, token });
  const { createNotification } = useContext(ToastContext);

  // optimistically track the votes
  const [upvotes, setUpvotes] = useState<number>(record.upvotes || 0);

  // this optimistically updates the vote count and then resets again if failure
  const vote = useCallback(
    async (direction: DuckVoteVariables['direction']) => {
      const amount = direction === VOTE_DIRECTION.DOWN ? -1 : 1;
      try {
        setUpvotes(currentVotes => currentVotes + amount);
        await duckVoteMutation.mutateAsync({ direction });
      } catch (error: unknown) {
        setUpvotes(currentVotes => currentVotes - amount);

        createNotification(
          <Toast level="danger" variant="colored">
            <Rhythm py={4}>
              <Typography size="xlarge">
                {error instanceof Error
                  ? error.message
                  : `There was an error updating the vote for ${record.headline}.`}
              </Typography>
            </Rhythm>
          </Toast>,
        );
      }
    },
    [createNotification, duckVoteMutation, record.headline],
  );

  const handleDownVote = useCallback(() => {
    void vote(VOTE_DIRECTION.DOWN);
  }, [vote]);

  const handleUpVote = useCallback(() => {
    void vote(VOTE_DIRECTION.UP);
  }, [vote]);

  return (
    <Flex alignItems="center" direction="row">
      <IconButton
        as="button"
        color={token ? 'primary' : 'neutral'}
        disabled={!token || duckVoteMutation.isPending}
        loader={<SpinnerIcon scale="medium" />}
        onClick={handleDownVote}
        shape="square"
        size="small"
        title="Downvote duck"
        type="button"
        weight="ghost"
      >
        <ArrowDownIcon scale="small" />
      </IconButton>

      <Rhythm mx={2}>
        <Typography<'div'> as="div" size="xlarge" weight="bold">
          {upvotes}
        </Typography>
      </Rhythm>

      <IconButton
        as="button"
        color={token ? 'primary' : 'neutral'}
        disabled={!token || duckVoteMutation.isPending}
        loader={<SpinnerIcon scale="medium" />}
        onClick={handleUpVote}
        shape="square"
        size="small"
        title="Upvote duck"
        type="button"
        weight="ghost"
      >
        <ArrowUpIcon scale="small" />
      </IconButton>
    </Flex>
  );
};
