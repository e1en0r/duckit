import styled from '@emotion/styled';
import { Paper, PaperProps } from '@phork/phorkit';

export type PagePaperProps = PaperProps & {
  autoHeight?: boolean;
  centered?: boolean;
};

export const PagePaper = styled(Paper, {
  shouldForwardProp: (prop: string) => !['autoHeight', 'centered'].includes(prop),
})<{ autoHeight?: boolean; centered?: boolean }>`
  ${({ autoHeight }) => !autoHeight && 'min-height: 100%;'}
  ${({ centered }) => centered && `align-items: center; justify-content: center;`}

  background: transparent;
`;

PagePaper.displayName = 'PagePaper';
