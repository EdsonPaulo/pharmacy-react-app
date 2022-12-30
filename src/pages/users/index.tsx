import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback } from 'react';
import { UsersForm } from './users-form';
import { UsersList } from './users-list';

export const UsersPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddUser = useCallback(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Box flex={1} p={10}>
      <UsersList onPressAddNew={handleAddUser} />

      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: 'xl' }}
      >
        <ModalOverlay />

        <UsersForm onClose={onClose} />
      </Modal>
    </Box>
  );
};
