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
import { useMemo } from 'react';
import { useMutation } from 'react-query';
import { postCreateProductCategory } from '../../../services/products';
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

  const isViewMode = useMemo(() => mode === 'view', [mode]);

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
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: selectedProductCategory?.name ?? '',
    },
    onSubmit: (values) => {
      mutateAddProductCategory(values, {
        onSuccess: async () => {
          resetForm();
          toast({
            duration: 2000,
            position: 'top-right',
            variant: 'subtle',
            status: 'success',
            title: 'Categoria criada com sucesso!',
          });
          onRefetch();
          onClose();
        },
        onError: (e: any) => {
          toast({
            duration: 3000,
            position: 'top-right',
            variant: 'subtle',
            status: 'error',
            title:
              e?.response?.data?.message ??
              'Ocorreu um erro ao criar utilizador',
          });
        },
      });
    },
  });

  const isAddButtonDisabled = useMemo(
    () => isLoading || !isValid || isViewMode,
    [isLoading, isValid, isViewMode],
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
            isLoading={isLoading}
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
