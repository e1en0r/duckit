import styled from '@emotion/styled';
import { LineLoader, Modal, ModalBody, ModalProps } from '@phork/phorkit';

export interface ModalLoaderProps {
  size: ModalProps['size'];
}

const StyledModalBody = styled(ModalBody)`
  height: 200px;
`;

export const ModalLoader = ({ size, ...props }: ModalLoaderProps): React.ReactElement => {
  return (
    <Modal focusable size={size} {...props}>
      <StyledModalBody>
        <LineLoader position="top" />
      </StyledModalBody>
    </Modal>
  );
};

ModalLoader.displayName = 'ModalLoader';
