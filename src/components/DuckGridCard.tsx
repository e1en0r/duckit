import { Flex, Rhythm, Typography, useThemeId } from '@phork/phorkit';
import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import missing from 'assets/missing.jpg';
import { Duck } from 'types/duck';
import { DuckVote } from 'components/DuckVote';
import { useGridContext } from 'components/virtualizedGrid/context/useGridContext';
import { BaseGridCard } from './BaseGridCard';

export interface DuckGridCardProps {
  record: Duck;
}

const ImageContainer = styled('div')<{ width: number; height: number }>`
  flex: none;
  position: relative;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
`;

const Image = styled('img')`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled(Typography)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export function DuckGridCard({ record }: DuckGridCardProps): React.ReactElement {
  const themeId = useThemeId();
  const { cardHeight, cardWidth } = useGridContext();
  const imageSize = cardWidth;

  const [error, setError] = useState(false);

  const handleImageError = useCallback(() => setError(true), []);

  return (
    <BaseGridCard height={cardHeight} raised={40} themeId={themeId} width={cardWidth}>
      <ImageContainer height={imageSize} width={imageSize}>
        <Image
          alt={error ? 'Missing duck image' : 'Duck image'}
          onError={handleImageError}
          src={error || !record.image ? missing : record.image}
        />
      </ImageContainer>
      <Rhythm px={5}>
        <Flex flexible alignItems="center" direction="row" justifyContent="space-between">
          <Title size="2xlarge" weight="bold">
            {record.headline}
          </Title>
          <DuckVote record={record} />
        </Flex>
      </Rhythm>
    </BaseGridCard>
  );
}
