import { Button, Header, Rhythm, Typography } from '@phork/phorkit';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Headline } from 'components/Headline';
import { LoginButton } from 'components/LoginButton';
import { LogoutButton } from 'components/LogoutButton';
import { useAuthenticationContext } from 'context/useAuthenticationContext';

const StyledLink = styled(Link)`
  color: currentColor;

  &:hover {
    opacity: 0.8;
  }
`;

export const PageHeader = (): React.ReactElement => {
  const [token] = useAuthenticationContext();

  return (
    <Rhythm px={8}>
      <Header bordered full variant="primary">
        <StyledLink to="/">
          <Headline>Duckit</Headline>
        </StyledLink>

        {token ? (
          <LogoutButton>
            <Button as="button" color="primary" shape="brick" size="large" weight="shaded">
              <Typography variants="medium-caps">Logout</Typography>
            </Button>
          </LogoutButton>
        ) : (
          <LoginButton>
            <Button as="button" color="primary" shape="brick" size="large" weight="shaded">
              <Typography variants="medium-caps">Login</Typography>
            </Button>
          </LoginButton>
        )}
      </Header>
    </Rhythm>
  );
};
