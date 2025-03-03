import { useContext } from 'react';
import { BaseGridRecordType, GridContext, GridContextValue } from './GridContext';

export const useGridContext = <RecordType extends BaseGridRecordType>(): GridContextValue<RecordType> => {
  const context = useContext(GridContext);

  if (!context) {
    throw new Error('useGridContext must be used within a GridProvider');
  }

  return context as GridContextValue<RecordType>;
};
