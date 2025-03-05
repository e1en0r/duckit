import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PagePaper } from 'components/PagePaper';

describe('PagePaper', () => {
  it('should render the content', () => {
    const { getByText } = render(<PagePaper>Hello world</PagePaper>);
    expect(getByText('Hello world')).toBeInTheDocument();
  });

  it('should render the default styles', () => {
    const { container } = render(<PagePaper>Hello world</PagePaper>);
    const element = container.firstChild as HTMLElement;

    expect(element).toHaveStyle('background: transparent');
    expect(element).toHaveStyle('min-height: 100%');
  });

  it('should render the additional styles', () => {
    const { container } = render(
      <PagePaper autoHeight centered>
        Hello world
      </PagePaper>,
    );
    const element = container.firstChild as HTMLElement;

    expect(element).not.toHaveStyle('min-height: 100%');
    expect(element).toHaveStyle('align-items: center; justify-content: center;');
  });
});
