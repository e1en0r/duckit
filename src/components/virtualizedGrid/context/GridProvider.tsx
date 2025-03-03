import React, { useMemo } from 'react';
import { BaseGridRecordType, GridContext, GridContextValue } from './GridContext';

export type GridProviderProps<RecordType extends BaseGridRecordType> = GridContextValue<RecordType> & {
  children: React.ReactNode;
};

export function GridProvider<RecordType extends BaseGridRecordType>({
  cardHeight,
  cardWidth,
  children,
  columnCount,
  component,
  leftShift,
  mx,
  my,
  placeholder,
  topShift,
}: GridProviderProps<RecordType>): React.ReactElement {
  const value = useMemo(
    () => ({
      cardHeight,
      cardWidth,
      columnCount,
      component,
      leftShift,
      mx,
      my,
      placeholder,
      topShift,
    }),
    [cardHeight, cardWidth, columnCount, component, leftShift, mx, my, placeholder, topShift],
  );

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}

GridProvider.displayName = 'GridProvider';
