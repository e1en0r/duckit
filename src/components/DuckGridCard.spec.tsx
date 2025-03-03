import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGridContext } from 'components/virtualizedGrid/context/useGridContext';
import { Duck } from 'types/duck';
import { GridContextValue, BaseGridRecordType } from 'components/virtualizedGrid/context';
import { DuckGridCard } from './DuckGridCard';

vi.mock('components/virtualizedGrid/context/useGridContext', () => ({
  useGridContext: vi.fn(),
}));

vi.mock('components/DuckVote', () => ({
  DuckVote: vi.fn(() => <div>Mocked DuckVote</div>),
}));

describe('DuckGridCard', () => {
  const mockDuck: Duck = {
    headline: 'Test Duck',
    image: 'https://example.com/duck.jpg',
    id: 'abc',
    upvotes: 0,
    author: 'Mock Author',
  };

  const missingImageDuck: Duck = {
    ...mockDuck,
    headline: 'Missing Image Duck',
    image: '',
  };

  const errorImageDuck: Duck = {
    ...mockDuck,
    headline: 'Error Image Duck',
    image: 'https://example.com/error.jpg',
  };

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

  it('should render the duck image correctly', () => {
    render(<DuckGridCard record={mockDuck} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockDuck.image);
    expect(image).toHaveAttribute('alt', 'Duck image');
  });

  it('should render the missing image when there is no image URL', () => {
    render(<DuckGridCard record={missingImageDuck} />);

    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', expect.stringContaining('missing.jpg'));
    expect(image).toHaveAttribute('alt', 'Missing duck image');
  });

  it('should render the missing image when image loading fails', () => {
    render(<DuckGridCard record={errorImageDuck} />);

    // Simulate image loading error
    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', expect.stringContaining('missing.jpg'));
    expect(image).toHaveAttribute('alt', 'Missing duck image');
  });

  it('should render the duck title correctly', () => {
    render(<DuckGridCard record={mockDuck} />);

    const title = screen.getByText(mockDuck.headline);
    expect(title).toBeInTheDocument();
    expect(title).toHaveStyle('overflow: hidden');
    expect(title).toHaveStyle('white-space: nowrap');
    expect(title).toHaveStyle('text-overflow: ellipsis');
  });

  it('should render the DuckVote component correctly', () => {
    render(<DuckGridCard record={mockDuck} />);

    const duckVote = screen.getByText('Mocked DuckVote');
    expect(duckVote).toBeInTheDocument();
  });

  it('should apply cardWidth and cardHeight correctly', () => {
    render(<DuckGridCard record={mockDuck} />);

    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveStyle(`width: ${mockCardWidth}px`);
    expect(imageContainer).toHaveStyle(`height: ${mockCardWidth}px`);
  });
});
