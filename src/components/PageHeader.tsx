import { Button, Flex, Header, IconButton, Rhythm, Typography, useGetWidth } from '@phork/phorkit';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Headline } from 'components/Headline';
import { LoginButton } from 'components/LoginButton';
import { LogoutButton } from 'components/LogoutButton';
import { useAuthenticationContext } from 'context/useAuthenticationContext';
import { CreatePostButton } from 'components/CreatePostButton';
import { viewports } from 'config/viewports';
import PlusIcon from 'assets/plus.svg?react';
import LogoutIcon from 'assets/logout.svg?react';

const StyledLink = styled(Link)`
  color: currentColor;

  &:hover {
    opacity: 0.8;
  }
`;

export const PageHeader = (): React.ReactElement => {
  const [token] = useAuthenticationContext();
  const width = useGetWidth();
  const isSmallViewport = width && width <= viewports.small.max;

  return (
    <Rhythm px={8}>
      <Header bordered full variant="primary">
        <StyledLink to="/">
          <Headline>Duckit</Headline>
        </StyledLink>

        {token ? (
          <Flex direction="row">
            <Rhythm ml={3}>
              <CreatePostButton>
                {isSmallViewport ? (
                  <IconButton color="primary" name="create-post" shape="square" size="large" weight="shaded">
                    <PlusIcon width={14} />
                  </IconButton>
                ) : (
                  <Button color="primary" name="create-post" shape="brick" size="large" weight="shaded">
                    <Typography variants="medium-caps">Create Post</Typography>
                  </Button>
                )}
              </CreatePostButton>
              <LogoutButton>
                {isSmallViewport ? (
                  <IconButton color="primary" name="create-post" shape="square" size="large" weight="shaded">
                    <LogoutIcon width={16} />
                  </IconButton>
                ) : (
                  <Button color="primary" name="logout" shape="brick" size="large" weight="shaded">
                    <Typography variants="medium-caps">Logout</Typography>
                  </Button>
                )}
              </LogoutButton>
            </Rhythm>
          </Flex>
        ) : (
          <Rhythm ml={3}>
            <LoginButton>
              <Button color="primary" name="login" shape="brick" size="large" weight="shaded">
                <Typography variants="medium-caps">Login</Typography>
              </Button>
            </LoginButton>
          </Rhythm>
        )}
      </Header>
    </Rhythm>
  );
};
