import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorNotification } from 'components/ErrorNotification';

describe('<ErrorNotification>', () => {
  it('should render the sad duck', () => {
    const { getByTitle } = render(<ErrorNotification />);

    const duck = getByTitle('Sad duck');
    expect(duck).toBeInTheDocument();
    expect(duck.parentElement?.nodeName).toBe('svg');
    expect(duck.parentElement?.nextSibling).not.toBeInTheDocument();
  });

  it('should render the sad duck and an error message', () => {
    const { getByText, getByTitle } = render(<ErrorNotification message="There was an error" />);

    expect(getByText('There was an error')).toBeInTheDocument();

    const duck = getByTitle('Sad duck');
    expect(duck).toBeInTheDocument();
    expect(duck.parentElement?.nodeName).toBe('svg');
    expect(duck.parentElement?.nextSibling).toBeInTheDocument();
  });
});
