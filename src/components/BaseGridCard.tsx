import styled from '@emotion/styled';
import { Card, CardProps, Theme, themes, withTheme } from '@phork/phorkit';

export type BaseGridCardProps = CardProps & {
  themeId?: Theme;
  width: number;
  height: number;
};

export const BaseGridCard: React.FC<BaseGridCardProps> = withTheme<BaseGridCardProps>(styled(Card, {
  shouldForwardProp: (prop: string) => !['width', 'height'].includes(prop),
})<BaseGridCardProps>`
  background-color: ${({ themeId }) => themes[themeId!]['extreme-palette-background-color']};
  border-radius: 4px;
  color: ${({ themeId }) => themes[themeId!]['primary-palette-text-color']};
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  position: relative;
`);
