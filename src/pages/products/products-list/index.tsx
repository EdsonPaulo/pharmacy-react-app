import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getProducts } from '../../../services/products';
import { IProduct } from '../../../typescript/types';
import { ProductsForm } from './products-form';
import { ProductsTable } from './products-table';

export const ProductsList = () => {
  const { data, isLoading, refetch } = useQuery('products', getProducts);
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddProduct = useCallback(() => {
    setFormMode('edit');
    setSelectedProduct(undefined);
    openForm();
  }, [openForm]);

  const handleViewProduct = useCallback(
    (user: IProduct) => {
      setSelectedProduct(user);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditProduct = useCallback(
    (user: IProduct) => {
      setFormMode('edit');
      setSelectedProduct(user);
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedProduct(undefined);
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
      <ProductsTable
        products={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddProduct}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
      />

      <Modal
        isCentered
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: 'xl' }}
      >
        <ModalOverlay />

        <ProductsForm
          mode={formMode}
          selectedProduct={selectedProduct}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
