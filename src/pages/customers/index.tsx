import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getCustomers } from '../../services/customers';
import { ICustomer } from '../../types/types';
import { CustomersForm } from './customers-form';
import { CustomersList } from './customers-list';

export const CustomersPage = () => {
  const { data, isLoading, refetch } = useQuery('customers', getCustomers);
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddCustomer = useCallback(() => {
    setFormMode('edit');
    setSelectedCustomer(undefined);
    openForm();
  }, [openForm]);

  const handleViewCustomer = useCallback(
    (customer: ICustomer) => {
      setSelectedCustomer(customer);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditCustomer = useCallback(
    (customer: ICustomer) => {
      setFormMode('edit');
      setSelectedCustomer(customer);
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedCustomer(undefined);
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
      <CustomersList
        customers={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddCustomer}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '4xl' }}
      >
        <ModalOverlay />

        <CustomersForm
          mode={formMode}
          selectedCustomer={selectedCustomer}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
