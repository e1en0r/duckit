import styled from '@emotion/styled';
import * as React from 'react';
import { Theme, withTheme } from '@phork/phorkit';

const lightGradient = `
linear-gradient(  90deg,
  rgba(244, 244, 245, 0) 0%,
  rgba(244, 244, 245, 0) 20%,
  rgba(244, 244, 245, 1) 40%,
  rgba(244, 244, 245, 1) 60%,
  rgba(244, 244, 245, 0) 80%,
  rgba(244, 244, 245, 0) 100%
);`;

const darkGradient = `
linear-gradient(
  90deg,
  rgba(33, 33, 40, 0) 0%,
  rgba(33, 33, 40, 0) 20%,
  rgba(33, 33, 40, 1) 40%,
  rgba(33, 33, 40, 1) 60%,
  rgba(33, 33, 40, 0) 80%,
  rgba(33, 33, 40, 0) 100%
);`;

export interface ShimmerProps {
  isLoaded?: boolean;
  themeId?: Theme;
}

export const Shimmer = React.memo(
  withTheme(styled('div', {
    shouldForwardProp: prop => prop !== 'themeId',
  })<ShimmerProps>`
    @keyframes animation {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(100%);
      }
    }

    display: flex;
    height: 100%;
    left: 0;
    opacity: 0.5;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 20;

    ${({ isLoaded, themeId }) =>
      !isLoaded &&
      `
    &:before {
      animation-delay: 1.5s;
      animation-duration: 3s;
      animation-iteration-count: infinite;
      animation-name: animation;
      animation-timing-function: linear;
      background: ${themeId === 'dark' ? darkGradient : lightGradient};
      content: '';
      height: 100%;
      left: 1px;
      position: absolute;
      top: 1px;
      transform: translateX(-100%);
      width: 100%;
      z-index: 2;
    }

    &:after {
      animation-duration: 3s;
      animation-iteration-count: infinite;
      animation-name: animation;
      animation-timing-function: linear;
      background: ${themeId === 'dark' ? darkGradient : lightGradient};
      content: '';
      height: 100%;
      left: 1px;
      position: absolute;
      top: 1px;
      transform: translateX(-100%);
      width: 100%;
    }
  `};
  `),
);

Shimmer.displayName = 'Shimmer';
