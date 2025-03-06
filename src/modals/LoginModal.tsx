import { useCallback, useContext, useState, useRef } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Flex,
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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useAuthenticate } from 'hooks/useAuthenticate';

interface FormInputs {
  email: string;
  password: string;
}

export type LoginModalProps = Omit<ModalProps, 'children' | 'focusable' | 'size'>;

export const LoginModal = (props: LoginModalProps): React.ReactElement => {
  const id = 'login';
  const contentRef = useRef<HTMLDivElement>(null);
  const { popModal } = useContext(ModalContext);
  const { authenticate, isAuthenticating, persist } = useAuthenticate();

  const schema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors: inputErrors },
  } = useForm<FormInputs>({ resolver: yupResolver(schema) });

  // these errors are mutation errors and are separate from the schema errors
  const [error, setError] = useState<string>();

  const handleAuthenticate = useCallback(
    async ({ email, password }: FormInputs) => {
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
    },
    [authenticate, persist, popModal],
  );

  return (
    <Modal focusable contextId={id} size="medium" {...props}>
      <form onSubmit={event => void handleSubmit(handleAuthenticate)(event)}>
        <ModalHeader key="header" modalId={id} title="Duckit Login" />
        <ModalBody scrollable key="content" ref={contentRef}>
          {error && (
            <Rhythm mb={3} px={4}>
              <Banner level="danger">{error}</Banner>
            </Rhythm>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Rhythm my={3}>
                <Textbox
                  transitional
                  label="Email"
                  size="3xlarge"
                  validity={inputErrors.email ? 'danger' : undefined}
                  variant="filled"
                  {...field}
                />
              </Rhythm>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Rhythm my={3}>
                <Password
                  transitional
                  label="Password"
                  size="3xlarge"
                  validity={inputErrors.password ? 'danger' : undefined}
                  variant="filled"
                  {...field}
                />
              </Rhythm>
            )}
          />
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
                disabled={isAuthenticating}
                key="login"
                loader={<SpinnerIcon size={16} />}
                loading={isAuthenticating}
                onClick={event => void handleSubmit(handleAuthenticate)(event)}
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
