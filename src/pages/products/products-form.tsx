/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  getProductCategories,
  postCreateProduct,
} from '../../services/products';
import { useFormik } from 'formik';
import { newProductSchema } from './products.helpers';
import { IProduct } from '../../typescript/types';

interface ProductsFormProps {
  mode: 'edit' | 'view';
  selectedProduct?: IProduct;
  onClose: () => void;
  onRefetch: () => void;
}

export const ProductsForm = ({
  selectedProduct,
  mode,
  onClose,
  onRefetch,
}: ProductsFormProps) => {
  const toast = useToast();
  const { data: productCategories = [], isLoading: isLoadingCategories } =
    useQuery('product-categories', getProductCategories);

  const { isLoading, mutate: mutateAddProduct } = useMutation(
    'create-product',
    postCreateProduct,
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
    validationSchema: newProductSchema,
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: selectedProduct?.name ?? '',
      price: selectedProduct?.price ?? '',
      description: selectedProduct?.description ?? '',
      manufacture_date: selectedProduct?.manufactureDate ?? '',
      expiration_date: selectedProduct?.expirationDate ?? '',
      product_category:
        selectedProduct?.productCategory?.pkProductCategory ?? '',
    },
    onSubmit: (values) => {
      mutateAddProduct(values as any, {
        onSuccess: async () => {
          resetForm();
          toast({
            duration: 2000,
            position: 'top-right',
            variant: 'subtle',
            status: 'success',
            title: 'Produto criado com sucesso!',
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
        <ModalHeader>{selectedProduct ? 'Editar' : 'Novo'} Produto</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="15px">
            <FormControl
              isInvalid={!isViewMode && !!errors?.name && !!touched.name}
              isRequired={!isViewMode}
            >
              <FormLabel>Nome do Produto</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedProduct?.name || '-'}</Text>
              ) : (
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={values.name}
                  disabled={isViewMode}
                  placeholder="ex.: Amoxiciclina"
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={!isViewMode && !!errors.price && !!touched.price}
            >
              <FormLabel>Preço</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedProduct?.price || '-'}</Text>
              ) : (
                <Input
                  id="price"
                  name="price"
                  type="price"
                  value={values.price}
                  disabled={isViewMode}
                  placeholder="0,00 KZ"
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode &&
                !!errors?.product_category &&
                !!touched.product_category
              }
            >
              <FormLabel>Categoria</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedProduct?.productCategory?.name || '-'}
                </Text>
              ) : (
                <Select
                  id="product_category"
                  name="product_category"
                  disabled={isViewMode}
                  value={values.product_category}
                  placeholder="Selecione um opção"
                  onChange={handleChange}
                  isDisabled={isLoadingCategories}
                >
                  {productCategories.map((pc) => (
                    <option
                      key={pc.pkProductCategory}
                      value={pc.pkProductCategory}
                    >
                      {pc.name}
                    </option>
                  ))}
                </Select>
              )}
              <FormErrorMessage>{errors.product_category}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !isViewMode &&
                !!errors.manufacture_date &&
                !!touched.manufacture_date
              }
            >
              <FormLabel>Data de fabricação</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedProduct?.manufactureDate
                    ? new Date(
                        selectedProduct?.manufactureDate,
                      ).toLocaleDateString('pt-PT')
                    : '-'}
                </Text>
              ) : (
                <Input
                  id="manufacture_date"
                  name="manufacture_date"
                  type="date"
                  value={values.manufacture_date}
                  placeholder={'dd/mm/aaaa'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.manufacture_date}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !isViewMode &&
                !!errors.expiration_date &&
                !!touched.expiration_date
              }
            >
              <FormLabel>Data de expiração</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedProduct?.expirationDate
                    ? new Date(
                        selectedProduct?.expirationDate,
                      ).toLocaleDateString('pt-PT')
                    : '-'}
                </Text>
              ) : (
                <Input
                  id="expiration_date"
                  name="expiration_date"
                  type="date"
                  value={values.expiration_date}
                  placeholder={'dd/mm/aaaa'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.expiration_date}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button mr={4} variant="ghost" onClick={onClose}>
            Fechar
          </Button>

          {!isViewMode && (
            <Button
              colorScheme="teal"
              background="brand.primary"
              isLoading={isLoading}
              disabled={isAddButtonDisabled}
              type="submit"
            >
              Submeter
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </form>
  );
};
