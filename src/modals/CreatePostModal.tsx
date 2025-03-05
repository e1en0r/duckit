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
  Rhythm,
  SpinnerIcon,
  Textbox,
  Toast,
  ToastContext,
  Typography,
} from '@phork/phorkit';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreatePost } from 'hooks/useCreatePost';
import { useAuthenticate } from 'hooks/useAuthenticate';
import { FETCH_POSTS_QUERY_KEY } from 'hooks/useFetchPosts';

interface FormInputs {
  headline: string;
  image: string;
}

export type CreatePostModalProps = Omit<ModalProps, 'children' | 'focusable' | 'size'>;

export const CreatePostModal = (props: CreatePostModalProps): React.ReactElement => {
  const id = 'create-post';
  const contentRef = useRef<HTMLDivElement>(null);
  const { popModal } = useContext(ModalContext);
  const { createNotification } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const { token } = useAuthenticate();
  const createPostMutation = useCreatePost({ token });

  const schema = yup
    .object({
      headline: yup.string().required(),
      image: yup.string().url().required(),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors: inputErrors },
  } = useForm<FormInputs>({ resolver: yupResolver(schema) });

  // these errors are mutation errors and are separate from the schema errors
  const [error, setError] = useState<string>();

  const handleCreatePost = useCallback(
    async ({ headline, image }: FormInputs) => {
      setError(undefined);

      if (headline && image) {
        try {
          await createPostMutation.mutateAsync({ headline, image });

          createNotification(
            <Toast level="success" variant="colored">
              <Rhythm py={4}>
                <Typography size="xlarge">Your duck was posted successfully!</Typography>
              </Rhythm>
            </Toast>,
          );

          // invalidate the ducks to force a refetch
          void queryClient.invalidateQueries({ queryKey: [FETCH_POSTS_QUERY_KEY] });

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
        setError('Missing headline or image.');
      }
    },
    [createNotification, createPostMutation, popModal, queryClient],
  );

  return (
    <Modal focusable contextId={id} size="medium" {...props}>
      <form onSubmit={event => void handleSubmit(handleCreatePost)(event)}>
        <ModalHeader key="header" modalId={id} title="Add a Duck" />
        <ModalBody scrollable key="content" ref={contentRef}>
          {error && (
            <Rhythm mb={3} px={4}>
              <Banner level="danger">{error}</Banner>
            </Rhythm>
          )}

          <Controller
            control={control}
            name="headline"
            render={({ field }) => (
              <Rhythm my={3}>
                <Textbox
                  transitional
                  label="Headline"
                  size="3xlarge"
                  validity={inputErrors.headline ? 'danger' : undefined}
                  variant="filled"
                  {...field}
                />
              </Rhythm>
            )}
          />

          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <Rhythm my={3}>
                <Textbox
                  transitional
                  label="Image URL"
                  size="3xlarge"
                  validity={inputErrors.image ? 'danger' : undefined}
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
                disabled={createPostMutation.isPending}
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
                loading={createPostMutation.isPending}
                onClick={event => void handleSubmit(handleCreatePost)(event)}
                shape="brick"
                size="large"
                type="submit"
                weight="shaded"
              >
                <Typography variants="medium-caps">Add Duck</Typography>
              </Button>
            </ButtonGroup>
          </Flex>
        </ModalFooter>
      </form>
    </Modal>
  );
};
