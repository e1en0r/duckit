import { useMemo } from 'react';
import { useGetSize } from '@phork/phorkit';
import styled from '@emotion/styled';
import { GRID_CARD_WIDTH, GRID_CARD_HEIGHT, MAX_GRID_COLUMNS, GRID_MX, GRID_MY } from 'config/sizes';
import { VirtualizedGrid, VirtualizedGridProps } from 'components/virtualizedGrid/VirtualizedGrid';
import { BaseGridRecordType } from 'components/virtualizedGrid/context';
import { Shimmer } from 'components/Shimmer';
import { getColumnWidth, getRowHeight } from 'utils/size';

export type ListPageGridLoaderProps = Omit<
  VirtualizedGridProps,
  'component' | 'height' | 'placeholder' | 'records' | 'width'
> & {
  loading: boolean;
  maxCards?: number;
  minCards?: number;
  placeholder: NonNullable<VirtualizedGridProps['placeholder']>;
};

const LoadingContainer = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
`;

export const ListPageGridLoader = ({
  cardHeight = GRID_CARD_HEIGHT,
  cardWidth = GRID_CARD_WIDTH,
  loading,
  maxCards = 40,
  maxColumns = MAX_GRID_COLUMNS,
  minCards = 6,
  mx = GRID_MX,
  my = GRID_MY,
  placeholder,
}: ListPageGridLoaderProps): React.ReactElement | null => {
  const { width, height } = useGetSize();

  const loaderCards = useMemo((): BaseGridRecordType[] => {
    let numCards = minCards;
    if (width && height) {
      const columnWidth = getColumnWidth({ cardWidth, mx });
      const rowHeight = getRowHeight({ cardHeight, my });
      const cardsPerPage = Math.ceil(width / columnWidth) * Math.ceil(height / rowHeight);
      numCards = Math.max(minCards, Math.min(maxCards, cardsPerPage));
    }
    return new Array(numCards).fill(null).map((_, i) => ({ id: `loader-${i}` }));
  }, [minCards, width, height, cardWidth, mx, cardHeight, my, maxCards]);

  return loading ? (
    <LoadingContainer>
      <VirtualizedGrid
        cardHeight={cardHeight}
        cardWidth={cardWidth}
        component={placeholder}
        height={height}
        maxColumns={maxColumns}
        placeholder={placeholder}
        records={loaderCards}
        width={width}
      />

      <Shimmer />
    </LoadingContainer>
  ) : null;
};

ListPageGridLoader.displayName = 'ListPageGridLoader';
