import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Headline } from 'components/Headline';

describe('Headline', () => {
  it('should render the headline', () => {
    const { getByText } = render(<Headline>Hello world</Headline>);
    expect(getByText('Hello world')).toBeInTheDocument();
  });

  it('should apply default styles correctly for Headline', () => {
    const { container } = render(<Headline />);
    const element = container.firstChild as HTMLElement;

    expect(element).toHaveStyle('font-family: Lulo Clean One Bold,Roboto,Helvetica,sans-serif');
    expect(element).toHaveStyle('font-size: 42px');
    expect(element).toHaveStyle('font-weight: normal');
    expect(element).toHaveStyle('margin: 0px -12px 0px 0px');
    expect(element).toHaveStyle('padding: 0');
    expect(element).toHaveStyle('position: relative');
    expect(element).toHaveStyle('width: fit-content');
  });
});
