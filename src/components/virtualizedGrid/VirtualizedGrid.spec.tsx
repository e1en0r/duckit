import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useGetSize } from '@phork/phorkit';
import { BaseGridRecordType } from 'components/virtualizedGrid/context';
import { VirtualizedGrid } from './VirtualizedGrid';

const mockData = new Array(12).fill(null).map((_, index) => ({ id: `record-${index}` }) as BaseGridRecordType);

vi.mock(import('@phork/phorkit'), async importOriginal => {
  const actual = await importOriginal();

  return {
    ...actual,
    useGetSize: vi.fn(),
  };
});

describe('VirtualizedGrid', () => {
  vi.mocked(useGetSize).mockReturnValue({
    width: 1800,
    height: 1200,
  });

  it('should render the items at the correct positions', () => {
    const { getAllByText } = render(
      <VirtualizedGrid
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={1200}
        records={mockData}
        width={1800}
      />,
    );

    // the 30px comes from GRID_TOP_OFFSET in config/sizes
    const gridItems = getAllByText(/Record record-/);
    expect(gridItems[0].parentElement?.style?.left).toBe('259px');
    expect(gridItems[0].parentElement?.style?.top).toBe('30px');

    expect(gridItems[1].parentElement?.style?.left).toBe('515px');
    expect(gridItems[1].parentElement?.style?.top).toBe('30px');

    expect(gridItems[2].parentElement?.style?.left).toBe('771px');
    expect(gridItems[2].parentElement?.style?.top).toBe('30px');

    expect(gridItems[3].parentElement?.style?.left).toBe('1027px');
    expect(gridItems[3].parentElement?.style?.top).toBe('30px');

    expect(gridItems[4].parentElement?.style?.left).toBe('1283px');
    expect(gridItems[4].parentElement?.style?.top).toBe('30px');

    expect(gridItems[5].parentElement?.style?.left).toBe('259px');
    expect(gridItems[5].parentElement?.style?.top).toBe('446px');

    expect(gridItems[6].parentElement?.style?.left).toBe('515px');
    expect(gridItems[6].parentElement?.style?.top).toBe('446px');

    expect(gridItems[7].parentElement?.style?.left).toBe('771px');
    expect(gridItems[7].parentElement?.style?.top).toBe('446px');

    expect(gridItems[8].parentElement?.style?.left).toBe('1027px');
    expect(gridItems[8].parentElement?.style?.top).toBe('446px');

    expect(gridItems[9].parentElement?.style?.left).toBe('1283px');
    expect(gridItems[9].parentElement?.style?.top).toBe('446px');
  });

  it('should render the items at the correct positions with custom margins', () => {
    const { getAllByText } = render(
      <VirtualizedGrid
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={1200}
        mx={2}
        my={4}
        records={mockData}
        width={1800}
      />,
    );

    const gridItems = getAllByText(/Record record-/);
    expect(gridItems[0].parentElement?.style?.left).toBe('359px');
    expect(gridItems[0].parentElement?.style?.top).toBe('30px');

    expect(gridItems[1].parentElement?.style?.left).toBe('575px');
    expect(gridItems[1].parentElement?.style?.top).toBe('30px');

    expect(gridItems[2].parentElement?.style?.left).toBe('791px');
    expect(gridItems[2].parentElement?.style?.top).toBe('30px');

    expect(gridItems[3].parentElement?.style?.left).toBe('1007px');
    expect(gridItems[3].parentElement?.style?.top).toBe('30px');

    expect(gridItems[4].parentElement?.style?.left).toBe('1223px');
    expect(gridItems[4].parentElement?.style?.top).toBe('30px');

    expect(gridItems[5].parentElement?.style?.left).toBe('359px');
    expect(gridItems[5].parentElement?.style?.top).toBe('422px');

    expect(gridItems[6].parentElement?.style?.left).toBe('575px');
    expect(gridItems[6].parentElement?.style?.top).toBe('422px');

    expect(gridItems[7].parentElement?.style?.left).toBe('791px');
    expect(gridItems[7].parentElement?.style?.top).toBe('422px');

    expect(gridItems[8].parentElement?.style?.left).toBe('1007px');
    expect(gridItems[8].parentElement?.style?.top).toBe('422px');

    expect(gridItems[9].parentElement?.style?.left).toBe('1223px');
    expect(gridItems[9].parentElement?.style?.top).toBe('422px');
  });

  it('should render a single column grid with 3 rows', () => {
    const { getAllByText, getByText, queryByText } = render(
      <VirtualizedGrid
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={500}
        records={mockData}
        width={500}
      />,
    );

    expect(getByText('Record record-0')).toBeInTheDocument();
    expect(getByText('Record record-2')).toBeInTheDocument();
    expect(queryByText('Record record-3')).not.toBeInTheDocument();

    const gridItems = getAllByText(/Record record-/);
    const numColumns = new Set(gridItems.map(item => item.parentElement?.style.left)).size;
    expect(numColumns).toBe(1);

    const numRows = new Set(gridItems.map(item => item.parentElement?.style.top)).size;
    expect(numRows).toBe(3);
  });

  it('should render a single column grid with 3 rows and 2 overscan rows', () => {
    vi.mocked(useGetSize).mockReturnValue({
      width: 500,
      height: 500,
    });

    const { getAllByText, getByText, queryByText } = render(
      <VirtualizedGrid
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={500}
        overscanRowCount={3}
        records={mockData}
        width={500}
      />,
    );

    expect(getByText('Record record-0')).toBeInTheDocument();
    expect(getByText('Record record-4')).toBeInTheDocument();
    expect(queryByText('Record record-5')).not.toBeInTheDocument();

    const gridItems = getAllByText(/Record record-/);
    const numColumns = new Set(gridItems.map(item => item.parentElement?.style.left)).size;
    expect(numColumns).toBe(1);

    const numRows = new Set(gridItems.map(item => item.parentElement?.style.top)).size;
    expect(numRows).toBe(5);
  });

  it('should render a 5 column grid with 3 rows', () => {
    vi.mocked(useGetSize).mockReturnValue({
      width: 1800,
      height: 1200,
    });

    const { getAllByText, getByText } = render(
      <VirtualizedGrid
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={1200}
        records={mockData}
        width={1800}
      />,
    );

    expect(getByText('Record record-0')).toBeInTheDocument();
    expect(getByText('Record record-11')).toBeInTheDocument();

    const gridItems = getAllByText(/Record record-/);
    const numColumns = new Set(gridItems.map(item => item.parentElement?.style.left)).size;
    expect(numColumns).toBe(5);

    const numRows = new Set(gridItems.map(item => item.parentElement?.style.top)).size;
    expect(numRows).toBe(3);
  });

  it('should render a grid width max columns', () => {
    vi.mocked(useGetSize).mockReturnValue({
      width: 1800,
      height: 1200,
    });

    const { getAllByText, getByText, queryByText } = render(
      <VirtualizedGrid
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={1200}
        maxColumns={2}
        records={mockData}
        width={1800}
      />,
    );

    expect(getByText('Record record-0')).toBeInTheDocument();
    expect(getByText('Record record-7')).toBeInTheDocument();
    expect(queryByText('Record record-8')).not.toBeInTheDocument();

    const gridItems = getAllByText(/Record record-/);
    const numColumns = new Set(gridItems.map(item => item.parentElement?.style.left)).size;
    expect(numColumns).toBe(2);

    const numRows = new Set(gridItems.map(item => item.parentElement?.style.top)).size;
    expect(numRows).toBe(4);
  });

  it('should clip the records when showing an infinite scroll loading page', () => {
    vi.mocked(useGetSize).mockReturnValue({
      width: 900,
      height: 1200,
    });

    const { getByText, queryByText } = render(
      <VirtualizedGrid
        infinite
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={1200}
        records={mockData.slice(0, 7)}
        width={900}
      />,
    );

    expect(getByText('Record record-0')).toBeInTheDocument();
    expect(getByText('Record record-5')).toBeInTheDocument();
    expect(queryByText('Record record-6')).not.toBeInTheDocument();
  });

  it('should call onItemsRendered when the grid renders', () => {
    const onItemsRendered = vi.fn();

    render(
      <VirtualizedGrid
        infinite
        cardHeight={300}
        cardWidth={200}
        component={({ record }) => <div>Record {record.id}</div>}
        height={1200}
        onItemsRendered={onItemsRendered}
        records={mockData}
        width={900}
      />,
    );

    expect(onItemsRendered).toHaveBeenCalled();
  });
});
