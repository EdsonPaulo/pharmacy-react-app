import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getPurchases } from '../../services/purchase';
import { IPurchase } from '../../typescript/types';
import { PurchasesForm } from './purchases-form';
import { PurchasesList } from './purchases-list';

export const PurchasesPage = () => {
  const { data, isLoading, refetch } = useQuery('purchases', getPurchases);
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedPurchase, setSelectedPurchase] = useState<IPurchase>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddPurchase = useCallback(() => {
    setFormMode('edit');
    setSelectedPurchase(undefined);
    openForm();
  }, [openForm]);

  const handleViewPurchase = useCallback(
    (purchase: IPurchase) => {
      setSelectedPurchase(purchase);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditPurchase = useCallback(
    (purchase: IPurchase) => {
      setSelectedPurchase(purchase);
      setFormMode('edit');
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedPurchase(undefined);
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
      <PurchasesList
        purchases={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddPurchase}
        onView={handleViewPurchase}
        onEdit={handleEditPurchase}
        onRefetch={handleRefetch}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '2xl' }}
      >
        <ModalOverlay />

        <PurchasesForm
          mode={formMode}
          selectedPurchase={selectedPurchase}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
