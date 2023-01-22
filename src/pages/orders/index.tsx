import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getOrders } from '../../services/orders';
import { IOrder } from '../../typescript/types';
import { OrdersForm } from './orders-form';
import { OrdersList } from './orders-list';

export const OrdersPage = () => {
  const { data, isLoading, refetch } = useQuery('orders', getOrders);
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<IOrder>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddOrder = useCallback(() => {
    setFormMode('edit');
    setSelectedOrder(undefined);
    openForm();
  }, [openForm]);

  const handleViewOrder = useCallback(
    (order: IOrder) => {
      setSelectedOrder(order);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditOrder = useCallback(
    (order: IOrder) => {
      setSelectedOrder(order);
      setFormMode('edit');
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedOrder(undefined);
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
      <OrdersList
        orders={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddOrder}
        onView={handleViewOrder}
        onEdit={handleEditOrder}
        onRefetch={handleRefetch}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '2xl' }}
      >
        <ModalOverlay />

        <OrdersForm
          mode={formMode}
          selectedOrder={selectedOrder}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
