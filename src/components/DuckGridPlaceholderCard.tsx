import { Flex, Paper, Rhythm, Typography, useThemeId } from '@phork/phorkit';
import styled from '@emotion/styled';
import Placeholder from 'assets/silhouette.svg?react';
import { Duck } from 'types/duck';
import { useGridContext } from 'components/virtualizedGrid/context';
import { BaseGridCard } from './BaseGridCard';

export interface DuckGridCardProps {
  record: Duck;
}

const ImageContainer = styled(Paper)<{ width: number; height: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};

  > svg {
    opacity: 0.3;
  }
`;

export function DuckGridPlaceholderCard(): React.ReactElement {
  const themeId = useThemeId();
  const { cardHeight, cardWidth } = useGridContext();
  const imageSize = cardWidth;

  return (
    <BaseGridCard height={cardHeight} raised={40} themeId={themeId} width={cardWidth}>
      <ImageContainer color="tertiary" height={imageSize} width={imageSize}>
        <Placeholder width={Math.floor(imageSize / 2)} />
      </ImageContainer>
      <Rhythm px={5}>
        <Flex flexible alignItems="center" direction="row" justifyContent="center">
          <Typography size="2xlarge" variants="spoiler" volume="quietest">
            This duck is loading...
          </Typography>
        </Flex>
      </Rhythm>
    </BaseGridCard>
  );
}
