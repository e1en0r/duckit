import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { VirtualizedGridItem } from './VirtualizedGridItem';
import { BaseGridRecordType, GridContextValue, useGridContext } from './context';

vi.mock('components/virtualizedGrid/context/useGridContext', () => ({
  useGridContext: vi.fn(),
}));

const mockContextValue = {
  cardWidth: 200,
  cardHeight: 300,
  columnCount: 3,
  component: ({ record }) => <div>Record {record.id}</div>,
  leftShift: 10,
  topShift: 20,
  mx: 1,
  my: 1,
  placeholder: ({ record }) => <div>Placeholder {record.id}</div>,
} as GridContextValue<BaseGridRecordType>;

const mockData = new Array(12).fill(null).map((_, index) => ({ id: `record-${index}` }) as BaseGridRecordType);

describe('VirtualizedGridItem', () => {
  it('should render a grid item with the provided record', () => {
    vi.mocked(useGridContext).mockReturnValue(mockContextValue);

    const { getByText } = render(
      <VirtualizedGridItem columnIndex={1} data={mockData} rowIndex={3} style={{ left: 0, top: 0 }} />,
    );

    expect(getByText('Record record-10')).toBeInTheDocument();
  });

  it('should render a placeholder when scrolling', () => {
    vi.mocked(useGridContext).mockReturnValue(mockContextValue);

    const { getByText } = render(
      <VirtualizedGridItem isScrolling columnIndex={1} data={mockData} rowIndex={3} style={{ left: 0, top: 0 }} />,
    );

    expect(getByText('Placeholder record-10')).toBeInTheDocument();
  });

  it('should render a placeholder when scrolling and no record', () => {
    vi.mocked(useGridContext).mockReturnValue(mockContextValue);

    const { getByText } = render(
      <VirtualizedGridItem isScrolling columnIndex={1} data={[]} rowIndex={3} style={{ left: 0, top: 0 }} />,
    );

    expect(getByText('Placeholder placeholder-10')).toBeInTheDocument();
  });

  it('does not render a placeholder when scrolling and displaying the first row', () => {
    vi.mocked(useGridContext).mockReturnValue(mockContextValue);

    const { getByText } = render(
      <VirtualizedGridItem isScrolling columnIndex={0} data={mockData} rowIndex={0} style={{ left: 0, top: 0 }} />,
    );

    expect(getByText('Record record-0')).toBeInTheDocument();
  });

  it('does not render anything if there is no record and no placeholder', () => {
    vi.mocked(useGridContext).mockReturnValue({
      ...mockContextValue,
      component: undefined!,
      placeholder: undefined,
    });

    const { container } = render(
      <VirtualizedGridItem isScrolling columnIndex={1} data={mockData} rowIndex={3} style={{ left: 0, top: 0 }} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should apply shifted styles correctly', () => {
    vi.mocked(useGridContext).mockReturnValue(mockContextValue);

    const { container } = render(
      <VirtualizedGridItem
        columnIndex={1}
        data={mockData}
        rowIndex={1}
        style={{ left: 5, top: 10, position: 'absolute' }}
      />,
    );

    expect(container.firstChild).toHaveStyle({
      left: '15px',
      top: '30px',
      position: 'absolute',
    });
  });
});
