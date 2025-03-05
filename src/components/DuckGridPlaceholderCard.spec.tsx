import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseGridRecordType, GridContextValue, useGridContext } from 'components/virtualizedGrid/context';
import { DuckGridPlaceholderCard } from './DuckGridPlaceholderCard';

vi.mock('components/virtualizedGrid/context', () => ({
  useGridContext: vi.fn(),
}));

vi.mock('assets/silhouette.svg?react', () => ({
  default: ({ width }: { width: number }) => <svg data-testid="placeholder-svg" width={width} />,
}));

describe('DuckGridPlaceholderCard', () => {
  const mockCardWidth = 200;
  const mockCardHeight = 300;

  beforeEach(() => {
    vi.mocked(useGridContext).mockReturnValue({
      cardWidth: mockCardWidth,
      cardHeight: mockCardHeight,
    } as GridContextValue<BaseGridRecordType>);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render the placeholder image correctly', () => {
    const { getByTestId } = render(<DuckGridPlaceholderCard />);
    const placeholder = getByTestId('placeholder-svg');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder.getAttribute('width')).toBe('100');
  });

  it('should render the placeholder text correctly', () => {
    const { getByText } = render(<DuckGridPlaceholderCard />);
    expect(getByText('This duck is loading')).toBeInTheDocument();
    expect(getByText('...')).toBeInTheDocument();
  });

  it('should apply cardWidth and cardHeight correctly', () => {
    const { getByTestId } = render(<DuckGridPlaceholderCard />);

    const imageContainer = getByTestId('placeholder-svg').parentElement;
    expect(imageContainer).toHaveStyle(`width: ${mockCardWidth}px`);
    expect(imageContainer).toHaveStyle(`height: ${mockCardWidth}px`);
  });
});
