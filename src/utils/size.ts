import { GRID_CARD_WIDTH, GRID_CARD_HEIGHT, GRID_MX, GRID_MY, LAYOUT_GRID_BASE } from 'config/sizes';

export const getColumnWidth = ({
  cardWidth = GRID_CARD_WIDTH,
  mx = GRID_MX,
}: {
  cardWidth?: number;
  mx?: number;
}): number => cardWidth + mx * LAYOUT_GRID_BASE * 2;

export const getRowHeight = ({
  cardHeight = GRID_CARD_HEIGHT,
  my = GRID_MY,
}: {
  cardHeight?: number;
  my?: number;
}): number => cardHeight + my * LAYOUT_GRID_BASE * 2;
