import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getSuppliers } from '../../services/supplier';
import { ISupplier } from '../../typescript/types';
import { SupplierForm } from './supplier-form';
import { SupplierList } from './supplier-list';

export const SuppliersPage = () => {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const { data, isLoading, refetch } = useQuery('suppliers', () =>
    getSuppliers(),
  );
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddSupplier = useCallback(() => {
    setFormMode('edit');
    setSelectedSupplier(undefined);
    openForm();
  }, [openForm]);

  const handleViewSupplier = useCallback(
    (supplier: ISupplier) => {
      setSelectedSupplier(supplier);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditSupplier = useCallback(
    (supplier: ISupplier) => {
      setFormMode('edit');
      setSelectedSupplier(supplier);
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedSupplier(undefined);
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
      <SupplierList
        suppliers={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddSupplier}
        onView={handleViewSupplier}
        onEdit={handleEditSupplier}
        onRefetch={handleRefetch}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '4xl' }}
      >
        <ModalOverlay />

        <SupplierForm
          mode={formMode}
          selectedSupplier={selectedSupplier}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
