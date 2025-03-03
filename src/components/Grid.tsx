import { Fragment } from 'react';
import { ListPageGridLoader } from 'components/virtualizedGrid/ListPageGridLoader';
import { VirtualizedGrid, VirtualizedGridProps } from 'components/virtualizedGrid/VirtualizedGrid';
import { BaseGridRecordType } from 'components/virtualizedGrid/context';

export interface GridProps<Item extends BaseGridRecordType>
  extends Omit<VirtualizedGridProps<Item>, 'component' | 'placeholder' | 'records'> {
  Card: React.FC<{ record: Item }>;
  PlaceholderCard: React.FC;
  data: Item[] | undefined;
  isPending?: boolean;
}

export const Grid = <Item extends BaseGridRecordType>({
  Card,
  PlaceholderCard,
  data,
  isPending,
  ...props
}: GridProps<Item>): React.ReactElement => {
  return (
    <Fragment>
      {!!data?.length && (
        <VirtualizedGrid<Item>
          component={Card}
          overscanRowCount={2}
          placeholder={PlaceholderCard}
          records={data}
          {...props}
        />
      )}

      <ListPageGridLoader loading={!!isPending} placeholder={PlaceholderCard} {...props} />
    </Fragment>
  );
};
