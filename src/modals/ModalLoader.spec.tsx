import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ModalLoader } from 'modals/ModalLoader';

describe('ModalLoader', () => {
  it('should render a modal loader', () => {
    const { getByLabelText } = render(<ModalLoader size="medium" />);
    expect(getByLabelText('Loading...')).toBeTruthy();
  });
});
