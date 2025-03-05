import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BaseGridCard } from 'components/BaseGridCard';

describe('BaseGridCard', () => {
  it('should render the grid card content', () => {
    const { getByText } = render(
      <BaseGridCard height={300} width={200}>
        Hello world
      </BaseGridCard>,
    );
    expect(getByText('Hello world')).toBeInTheDocument();
  });

  it('should apply default styles correctly for BaseGridCard', () => {
    const { container } = render(
      <BaseGridCard height={300} width={200}>
        Hello world
      </BaseGridCard>,
    );
    const element = container.firstChild as HTMLElement;

    expect(element).toHaveStyle('background-color: rgb(255, 255, 255)');
    expect(element).toHaveStyle('color: rgb(58, 58, 64)');
    expect(element).toHaveStyle('border-radius: 4px');
    expect(element).toHaveStyle('height: 300px');
    expect(element).toHaveStyle('width: 200px');
    expect(element).toHaveStyle('margin-left: auto');
    expect(element).toHaveStyle('margin-right: auto');
    expect(element).toHaveStyle('overflow: hidden');
    expect(element).toHaveStyle('position: relative');
  });
});
