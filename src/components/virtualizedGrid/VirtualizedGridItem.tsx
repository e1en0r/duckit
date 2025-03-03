import styled from '@emotion/styled';
import * as React from 'react';
import { GridChildComponentProps } from 'react-window';
import { config } from '@phork/phorkit';
import { BaseGridRecordType, useGridContext } from './context';
import { areEqual } from './utils';

const BASE_GRID_UNIT = parseInt(config['layout-grid-base'], 10);

const GridItem = styled('div', {
  shouldForwardProp: (prop: string) => !['mx', 'my'].includes(prop),
})<{ mx: number; my: number }>`
  padding: ${({ mx, my }) => `${mx * BASE_GRID_UNIT}px ${my * BASE_GRID_UNIT}px`};
`;

const extractLeftTop = (input?: string | number): number => {
  if (typeof input === 'number') return input;
  return 0;
};

export type VirtualizedGridItemProps<RecordType> = GridChildComponentProps<RecordType[]>;

function VirtualizedGridItemBase<RecordType extends BaseGridRecordType>({
  columnIndex,
  data,
  isScrolling,
  rowIndex,
  style,
}: VirtualizedGridItemProps<RecordType>) {
  const { columnCount, component, leftShift, mx = 0, my = 0, topShift, placeholder } = useGridContext<RecordType>();
  const index = columnCount * rowIndex + columnIndex;

  const GridItemContent = component;
  const GridPlaceholderContent = placeholder;
  const hasPlaceholder = typeof GridPlaceholderContent !== 'undefined';

  const shiftedStyle = {
    ...style,
    left: `${extractLeftTop(style?.left) + leftShift}px`,
    top: `${extractLeftTop(style?.top) + topShift}px`,
  };

  const record = data[index];

  // don't show the scrolling notification for the first couple rows
  if (hasPlaceholder && isScrolling && rowIndex > 2) {
    return (
      <GridItem mx={mx} my={my} style={shiftedStyle}>
        <GridPlaceholderContent record={record || { id: `placeholder-${index}` }} />
      </GridItem>
    );
  }

  return record && component ? (
    <GridItem key={record.id} mx={mx} my={my} style={shiftedStyle}>
      <GridItemContent record={record} />
    </GridItem>
  ) : null;
}

export const VirtualizedGridItem = React.memo(VirtualizedGridItemBase, areEqual) as typeof VirtualizedGridItemBase;

(VirtualizedGridItem as React.NamedExoticComponent).displayName = 'VirtualizedGridItem';
