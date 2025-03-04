import { useCallback, useContext, useState, useRef } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Flex,
  FormboxValue,
  Modal,
  ModalBody,
  ModalContext,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Password,
  Rhythm,
  SpinnerIcon,
  Textbox,
  Typography,
} from '@phork/phorkit';
import { useAuthenticate } from 'hooks/useAuthenticate';

export type LoginModalProps = Omit<ModalProps, 'children' | 'focusable' | 'size'>;

export const LoginModal = (props: LoginModalProps): React.ReactElement => {
  const id = 'login';
  const contentRef = useRef<HTMLDivElement>(null);
  const { popModal } = useContext(ModalContext);
  const { authenticate, isAuthenticating, persist } = useAuthenticate();

  const [email, setEmail] = useState<string>();
  const handleChangeEmail = useCallback((_e: React.ChangeEvent, value: FormboxValue) => setEmail(value as string), []);

  const [password, setPassword] = useState<string>();
  const handleChangePassword = useCallback(
    (_e: React.ChangeEvent, value: FormboxValue) => setPassword(value as string),
    [],
  );

  const [error, setError] = useState<string>();

  const handleAuthenticate = useCallback(async () => {
    setError(undefined);

    if (email && password) {
      try {
        const { token } = await authenticate({ email, password });
        persist(token);

        // close the modal on success
        popModal();
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error has occurred');
        }
      }
    } else {
      setError('Missing email or password.');
    }
  }, [authenticate, email, password, persist, popModal]);

  const handleLogin = useCallback(() => {
    void handleAuthenticate();
  }, [handleAuthenticate]);

  const handleSubmit = useCallback<React.FormEventHandler>(
    event => {
      event.preventDefault();
      handleLogin();
    },
    [handleLogin],
  );

  return (
    <Modal focusable contextId={id} size="medium" {...props}>
      <form onSubmit={handleSubmit}>
        <ModalHeader key="header" modalId={id} title="Duckit Login" />
        <ModalBody scrollable key="content" ref={contentRef}>
          {error && (
            <Rhythm mb={3} px={4}>
              <Banner level="danger">{error}</Banner>
            </Rhythm>
          )}

          <Rhythm my={3}>
            <Textbox
              transitional
              label="Email"
              name="email"
              onChange={handleChangeEmail}
              size="3xlarge"
              type="email"
              value={email}
              variant="filled"
            />
            <Password
              transitional
              label="Password"
              name="password"
              onChange={handleChangePassword}
              size="3xlarge"
              value={password}
              variant="filled"
            />
          </Rhythm>
        </ModalBody>
        <ModalFooter key="footer">
          <Flex direction="row" justifyContent="flex-end">
            <ButtonGroup spacing="cozy">
              <Button
                as="button"
                color="neutral"
                disabled={isAuthenticating}
                key="cancel"
                onClick={() => popModal()}
                shape="brick"
                size="large"
                weight="ghost"
              >
                <Typography variants="medium-caps">Cancel</Typography>
              </Button>
              <Button
                as="button"
                color="primary"
                key="login"
                loader={<SpinnerIcon size={16} />}
                loading={isAuthenticating}
                onClick={handleLogin}
                shape="brick"
                size="large"
                type="submit"
                weight="shaded"
              >
                <Typography variants="medium-caps">Login</Typography>
              </Button>
            </ButtonGroup>
          </Flex>
        </ModalFooter>
      </form>
    </Modal>
  );
};
