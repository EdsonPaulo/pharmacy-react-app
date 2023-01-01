import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getUsers } from '../../services/users';
import { IUser } from '../../types/types';
import { UsersForm } from './users-form';
import { UsersList } from './users-list';

export const UsersPage = () => {
  const { data, isLoading, refetch } = useQuery('users', getUsers);
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddUser = useCallback(() => {
    setFormMode('edit');
    setSelectedUser(undefined);
    openForm();
  }, [openForm]);

  const handleViewUser = useCallback(
    (user: IUser) => {
      setSelectedUser(user);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditUser = useCallback(
    (user: IUser) => {
      setFormMode('edit');
      setSelectedUser(user);
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedUser(undefined);
  }, [onClose]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const isEmpty = useMemo(
    () => !isLoading && (!data || data?.length === 0),
    [isLoading, data],
  );

  return (
    <Box flex={1} p={10}>
      <UsersList
        users={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddUser}
        onView={handleViewUser}
        onEdit={handleEditUser}
      />

      <Modal
        isCentered
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: 'xl' }}
      >
        <ModalOverlay />

        <UsersForm
          mode={formMode}
          selectedUser={selectedUser}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
