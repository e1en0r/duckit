import { GRID_CARD_HEIGHT, GRID_CARD_WIDTH, GRID_MX, GRID_MY, MAX_GRID_COLUMNS, MIN_GRID_WIDTH } from 'config/sizes';
import { getColumnWidth, getRowHeight } from 'utils/size';

export interface UseGridAxisCountsProps {
  cardHeight?: number;
  cardWidth?: number;
  containerWidth: number;
  itemCount: number;
  maxColumns?: number;
  minWidth?: number;
  mx?: number;
  my?: number;
}

export interface UseGridAxisCountsResponse {
  columnCount: number;
  columnWidth: number;
  gridWidth: number;
  rowCount: number;
  rowHeight: number;
}

export const useGridAxisCounts = ({
  cardHeight = GRID_CARD_HEIGHT,
  cardWidth = GRID_CARD_WIDTH,
  containerWidth,
  itemCount,
  maxColumns = MAX_GRID_COLUMNS,
  minWidth = MIN_GRID_WIDTH,
  mx = GRID_MX,
  my = GRID_MY,
}: UseGridAxisCountsProps): UseGridAxisCountsResponse => {
  const columnWidth = getColumnWidth({ cardWidth, mx });
  const rowHeight = getRowHeight({ cardHeight, my });

  // subtract 1px because it prevents scrollbars
  const gridWidth = Math.max(columnWidth, containerWidth, cardWidth, minWidth) - 1;

  const columnCount = Math.max(Math.min(Math.floor(gridWidth / columnWidth), maxColumns), 1);
  const rowCount = Math.ceil(itemCount / columnCount);

  return {
    columnCount,
    columnWidth,
    gridWidth,
    rowCount,
    rowHeight,
  };
};
