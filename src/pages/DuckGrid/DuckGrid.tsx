import { DuckGridCard } from 'components/DuckGridCard';
import { DuckGridPlaceholderCard } from 'components/DuckGridPlaceholderCard';
import { ErrorNotification } from 'components/ErrorNotification';
import { Grid } from 'components/Grid';
import { GRID_CARD_HEIGHT, GRID_CARD_WIDTH } from 'config/sizes';
import { useFetchDucks } from 'hooks/useFetchDucks';
import { Duck } from 'types/duck';

export const DuckGrid = (): React.ReactElement => {
  const { isPending, isError, error, data } = useFetchDucks();

  if (isError) {
    return <ErrorNotification full message={error.message || 'Unable to load the ducks.'} />;
  }

  if (!isPending && !data?.length) {
    return <ErrorNotification full message="There are no ducks around." />;
  }

  return (
    <Grid<Duck>
      Card={DuckGridCard}
      PlaceholderCard={DuckGridPlaceholderCard}
      cardHeight={GRID_CARD_HEIGHT}
      cardWidth={GRID_CARD_WIDTH}
      data={data}
      isPending={isPending}
    />
  );
};
