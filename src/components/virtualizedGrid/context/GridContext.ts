import { createContext } from 'react';

export interface BaseGridRecordType {
  id: React.Key;
}

export interface GridChildComponentProps<RecordType extends BaseGridRecordType> {
  record: RecordType;
}

export interface GridContextValue<RecordType extends BaseGridRecordType> {
  cardHeight: number;
  cardWidth: number;
  columnCount: number;
  component: React.ComponentType<GridChildComponentProps<RecordType>>;
  leftShift: number;
  mx?: number;
  my?: number;
  placeholder?: React.ComponentType<GridChildComponentProps<BaseGridRecordType>>;
  topShift: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GridContext = createContext<GridContextValue<any>>({} as GridContextValue<any>);
