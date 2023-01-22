import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useMutation } from 'react-query';
import {
  postCreateProductCategory,
  putEditProductCategory,
} from '../../../services/products';
import { IProductCategory } from '../../../typescript/types';
import { newProductCategorySchema } from './product-categories.helpers';

interface ProductCategoryFormProps {
  mode: 'edit' | 'view';
  selectedProductCategory?: IProductCategory;
  onClose: () => void;
  onRefetch: () => void;
}

export const ProductCategoryForm = ({
  selectedProductCategory,
  mode,
  onClose,
  onRefetch,
}: ProductCategoryFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddProductCategory } = useMutation(
    'create-product-category',
    postCreateProductCategory,
  );
  const { isLoading: isEditting, mutate: mutateEditProductCategory } =
    useMutation('edit-product-category', putEditProductCategory);

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const isEditMode = useMemo(
    () => mode === 'edit' && !!selectedProductCategory?.pkProductCategory,
    [mode, selectedProductCategory],
  );

  const onSuccessExtraCallback = useCallback(
    (type: 'edit' | 'create') => {
      toast({
        duration: 2000,
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: `Categoria ${
          type === 'edit' ? 'editada' : 'criada'
        } com sucesso!`,
      });
      onRefetch();
      onClose();
    },
    [onClose, onRefetch, toast],
  );

  const onErrorExtraCallback = useCallback(
    (message: string) => {
      toast({
        duration: 3000,
        position: 'top-right',
        variant: 'subtle',
        status: 'error',
        title: message,
      });
    },
    [toast],
  );

  const {
    handleSubmit,
    isValid,
    errors,
    touched,
    handleChange,
    resetForm,
    values,
  } = useFormik({
    validationSchema: newProductCategorySchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    initialValues: {
      name: selectedProductCategory?.name ?? '',
    },
    onSubmit: (values) => {
      if (isEditMode && !!selectedProductCategory) {
        mutateEditProductCategory(
          {
            name: values.name,
            productCategoryId: selectedProductCategory?.pkProductCategory,
          },
          {
            onSuccess: () => {
              resetForm();
              onSuccessExtraCallback('edit');
            },
            onError: (e: any) => {
              onErrorExtraCallback(
                e?.response?.data?.message ??
                  'Ocorreu um erro ao editar categoria',
              );
            },
          },
        );
      } else {
        mutateAddProductCategory(values, {
          onSuccess: () => {
            resetForm();
            onSuccessExtraCallback('create');
          },
          onError: (e: any) => {
            onErrorExtraCallback(
              e?.response?.data?.message ??
                'Ocorreu um erro ao criar categoria',
            );
          },
        });
      }
    },
  });

  const isAddButtonDisabled = useMemo(
    () => isLoading || isEditting || !isValid || isViewMode,
    [isEditting, isLoading, isValid, isViewMode],
  );

  return (
    <form onSubmit={handleSubmit}>
      <ModalContent>
        <ModalHeader>
          {selectedProductCategory ? 'Editar' : 'Nova'} Categoria
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl isInvalid={!!errors?.name && !!touched.name} isRequired>
            <FormLabel>Nome da Categoria</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              value={values.name}
              disabled={isViewMode}
              placeholder="ex.: Paracetamol"
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={4} variant="ghost" onClick={onClose}>
            Fechar
          </Button>

          <Button
            colorScheme="teal"
            background="brand.primary"
            isLoading={isLoading || isEditting}
            disabled={isAddButtonDisabled}
            type="submit"
          >
            Submeter
          </Button>
        </ModalFooter>
      </ModalContent>
    </form>
  );
};
