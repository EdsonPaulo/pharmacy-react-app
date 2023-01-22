import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getProductCategories } from '../../../services/products';
import { IProductCategory } from '../../../typescript/types';
import { ProductCategoryForm } from './product-categories-form';
import { ProductCategoriesList } from './product-categories-list';

export const ProductCategoriesPage = () => {
  const { data, isLoading, refetch } = useQuery(
    'product-categories',
    getProductCategories,
  );
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedProductCategory, setSelectedProductCategory] =
    useState<IProductCategory>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddProductCategory = useCallback(() => {
    setFormMode('edit');
    setSelectedProductCategory(undefined);
    openForm();
  }, [openForm]);

  const handleViewProductCategory = useCallback(
    (user: IProductCategory) => {
      setSelectedProductCategory(user);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditProductCategory = useCallback(
    (user: IProductCategory) => {
      setFormMode('edit');
      setSelectedProductCategory(user);
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedProductCategory(undefined);
  }, [onClose]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const isEmpty = useMemo(
    () => !isLoading && (!data || data?.length === 0),
    [isLoading, data],
  );

  return (
    <Box flex={1} px={10}>
      <ProductCategoriesList
        isEmpty={isEmpty}
        isLoading={isLoading}
        productCategories={data}
        onAddNew={handleAddProductCategory}
        onView={handleViewProductCategory}
        onEdit={handleEditProductCategory}
        onRefetch={handleRefetch}
      />

      <Modal
        isCentered
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: 'xl' }}
      >
        <ModalOverlay />

        <ProductCategoryForm
          mode={formMode}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
          selectedProductCategory={selectedProductCategory}
        />
      </Modal>
    </Box>
  );
};
