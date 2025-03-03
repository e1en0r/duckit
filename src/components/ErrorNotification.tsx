import { Flex, FlexProps, Rhythm, Typography } from '@phork/phorkit';
import Duck from 'assets/ducked.svg?react';

export type ErrorNotificationProps = Omit<FlexProps, 'direction'> & {
  message?: string;
};

export const ErrorNotification = ({ message, ...props }: ErrorNotificationProps): React.ReactElement => {
  return (
    <Flex alignItems="center" direction="column" justifyContent="center" {...props}>
      <Rhythm grouped my={6}>
        <Duck width={400} />

        {message && (
          <Rhythm mt={6}>
            <Typography<'h2'> align="center" as="h2" weight="bold">
              {message}
            </Typography>
          </Rhythm>
        )}
      </Rhythm>
    </Flex>
  );
};
