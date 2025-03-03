import styled from '@emotion/styled';
import {
  AccessibilityProvider,
  MainPanel,
  Modals,
  PanelContainer,
  Paper,
  PermanentStackPanel,
  SizeConsumer,
  SizeContext,
  SizeProvider,
  ThemeProvider,
  Toasts,
} from '@phork/phorkit';
import { PageHeader } from 'components/PageHeader';
import { MIN_GRID_WIDTH } from 'config/sizes';
import { viewports } from 'config/viewports';

export interface LayoutProps {
  children: React.ReactElement;
}

// a fix for mobile browsers because 100vh includes browser chrome
const ViewportPanelContainer = styled(PanelContainer)`
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  min-width: ${MIN_GRID_WIDTH}px;
`;

const urlParams = new URLSearchParams(window.location.search);
const isDark =
  urlParams.get('theme') === 'dark' ||
  (!urlParams.has('theme') && window.matchMedia?.('(prefers-color-scheme: dark)').matches);

const getHeaderHeight = (width: number | undefined): number => (width && width <= viewports.small.max ? 80 : 100);

export const Layout = ({ children }: LayoutProps): React.ReactElement => (
  <ThemeProvider themeId={isDark ? 'dark' : 'light'}>
    <AccessibilityProvider>
      <Toasts position="top-center">
        <Modals>
          <SizeProvider observe decimalPlaces={0}>
            {ref => (
              <SizeConsumer>
                {({ height, width, ...size }) => (
                  <ViewportPanelContainer viewport orientation="horizontal" ref={ref}>
                    <PermanentStackPanel data-testid="header" height={getHeaderHeight(width)} position="top">
                      <PageHeader />
                    </PermanentStackPanel>
                    <MainPanel data-testid="content">
                      {!!height && ( // instead of adding another watcher we can just calculate the content height by subtracting the header
                        <SizeContext.Provider value={{ ...size, width, height: height - getHeaderHeight(width) }}>
                          <Paper full scrollable color="primary">
                            {children}
                          </Paper>
                        </SizeContext.Provider>
                      )}
                    </MainPanel>
                  </ViewportPanelContainer>
                )}
              </SizeConsumer>
            )}
          </SizeProvider>
        </Modals>
      </Toasts>
    </AccessibilityProvider>
  </ThemeProvider>
);

Layout.displayName = 'Layout';
