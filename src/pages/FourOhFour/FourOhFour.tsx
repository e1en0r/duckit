import { Rhythm } from '@phork/phorkit';
import { ErrorNotification } from 'components/ErrorNotification';
import { PagePaper } from 'components/PagePaper';

export const FourOhFour = (): React.ReactElement => {
  return (
    <PagePaper centered flexible>
      <Rhythm grouped my={6}>
        <ErrorNotification message="Page not found" />
      </Rhythm>
    </PagePaper>
  );
};
