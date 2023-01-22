/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  FormHelperText,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  useToast,
  Box,
  Textarea,
} from '@chakra-ui/react';
import Select from 'react-select';
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { postCreateOrder, putEditOrder } from '../../services/orders';
import { useFormik } from 'formik';
import { orderSchema } from './orders.helpers';
import { IOrder } from '../../typescript/types';
import { getPersons } from '../../services/person';
import { UserTypeEnum } from '../../typescript/enums';
import { getProducts } from '../../services/products';
import { groupedSelectOptions } from '../../helpers/objectTransform';
import { OrderProductItem } from './order-product-item';

interface OrdersFormProps {
  mode: 'edit' | 'view';
  selectedOrder?: IOrder;
  onClose: () => void;
  onRefetch: () => void;
}

export const OrdersForm = ({
  selectedOrder,
  mode,
  onClose,
  onRefetch,
}: OrdersFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddOrder } = useMutation(
    'create-order',
    postCreateOrder,
  );
  const { isLoading: isEditting, mutate: mutateEditOrder } = useMutation(
    'edit-order',
    putEditOrder,
  );
  const { data: persons, isLoading: isLoadingPersons } = useQuery(
    'persons-all',
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    () => getPersons(),
  );
  const { data: products, isLoading: isLoadingProducts } = useQuery(
    'products',
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    () => getProducts(),
  );

  const productOptions = useMemo(
    () =>
      groupedSelectOptions(
        products
          ?.filter((p) => p.stock > 0)
          ?.map((p) => ({
            label: p.name,
            quantity: 1,
            value: p.pkProduct,
            category: p.productCategory?.name ?? 'Outros',
          })) ?? [],
        'category',
      ),
    [products],
  );

  const customerOptions = useMemo(
    () =>
      persons
        ?.filter((p) => p.user?.userType === UserTypeEnum.CUSTOMER)
        ?.map((p) => ({ value: p.pkPerson, label: p.name })) ?? [],
    [persons],
  );

  const employeeOptions = useMemo(
    () =>
      persons
        ?.filter((p) => p.user?.userType !== UserTypeEnum.CUSTOMER)
        ?.map((p) => ({ value: p.pkPerson, label: p.name })) ?? [],
    [persons],
  );

  const getCustomerAddresses = useCallback(
    (customer?: any) => {
      const customerId = customer?.value || customer;
      if (!customerId) return [];
      return (
        persons
          ?.filter((p) => p.pkPerson == customerId && !!p.address?.city)
          ?.map((p) => ({
            label: p.address?.name,
            value: p.address?.pkAddress,
          })) ?? []
      );
    },
    [persons],
  );

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const isEditMode = useMemo(
    () => mode === 'edit' && !!selectedOrder?.pkOrder,
    [mode, selectedOrder],
  );

  const onSuccessExtraCallback = useCallback(
    (type: 'edit' | 'create') => {
      toast({
        duration: 2000,
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: `Venda ${type === 'edit' ? 'editada' : 'criada'} com sucesso!`,
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
    errors,
    touched,
    handleChange,
    setFieldValue,
    resetForm,
    values,
  } = useFormik({
    validationSchema: orderSchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    initialValues: {
      observation: selectedOrder?.observation ?? '',
      order_date: selectedOrder?.orderDate ?? '',
      products:
        selectedOrder?.products?.map((p: any) => ({
          value: p.pkProduct,
          label: p.name,
          quantity: p.productOrder?.quantity,
          category: p.productCategory?.name,
        })) ?? [],
      fk_customer: selectedOrder?.customer
        ? {
            value: selectedOrder?.customer?.pkPerson,
            label: selectedOrder?.customer?.name,
          }
        : null,
      fk_address: selectedOrder?.address
        ? {
            value: selectedOrder?.address?.pkAddress,
            label: selectedOrder?.address?.name,
          }
        : null,
      fk_employee: selectedOrder?.employee
        ? {
            value: selectedOrder?.employee?.pkPerson,
            label: selectedOrder?.employee?.name,
          }
        : null,
    },
    onSubmit: (values) => {
      if (values.products.length == 0) {
        onErrorExtraCallback('Deve selecionar pelo menos um produto');
        return;
      }
      const formData = {
        ...values,
        order_date: values.order_date || null,
        fk_customer: values.fk_customer?.value ?? 0,
        fk_employee: values.fk_employee?.value ?? 0,
        fk_address: values.fk_address?.value ?? 0,
        products: values?.products?.map((p: any) => ({
          quantity: p.quantity,
          id: p.value,
        })),
      };
      if (isEditMode && !!selectedOrder) {
        mutateEditOrder(
          { order: formData, orderId: selectedOrder?.pkOrder },
          {
            onSuccess: () => {
              resetForm();
              onSuccessExtraCallback('edit');
            },
            onError: (e: any) => {
              onErrorExtraCallback(
                e?.response?.data?.message ??
                  'Ocorreu um erro ao editar encomenda',
              );
            },
          },
        );
      } else {
        mutateAddOrder(formData, {
          onSuccess: () => {
            resetForm();
            onSuccessExtraCallback('create');
          },
          onError: (e: any) => {
            onErrorExtraCallback(
              e?.response?.data?.message ??
                'Ocorreu um erro ao criar encomenda',
            );
          },
        });
      }
    },
  });

  const isAddButtonDisabled = useMemo(
    () => isLoading || isEditting || isViewMode,
    [isEditting, isLoading, isViewMode],
  );

  return (
    <form onSubmit={handleSubmit}>
      <ModalContent>
        <ModalHeader mt={4}>
          {isViewMode
            ? `Venda #0000${selectedOrder?.pkOrder!}`
            : isEditMode
            ? 'Editar Venda'
            : 'Novo Venda'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="25px">
            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode && !!errors?.fk_customer && !!touched?.fk_customer
              }
            >
              <FormLabel>Cliente</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedOrder?.customer?.name || '-'}
                </Text>
              ) : (
                <Select
                  id="fk_customer"
                  name="fk_customer"
                  isSearchable
                  value={values.fk_customer}
                  options={customerOptions as any}
                  placeholder={'Selecionar cliente'}
                  isLoading={isLoadingPersons}
                  onChange={(value) => {
                    setFieldValue('fk_customer', value);
                    setFieldValue('fk_address', null);
                  }}
                />
              )}
              <FormErrorMessage>{errors.fk_customer}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !isViewMode && !!errors.order_date && !!touched.order_date
              }
            >
              <FormLabel>Data da venda</FormLabel>
              {isViewMode ? (
                <Text
                  fontWeight="900"
                  color={
                    selectedOrder?.orderDate &&
                    new Date(selectedOrder?.orderDate).getTime() >
                      new Date().getTime()
                      ? 'red'
                      : 'inherit'
                  }
                >
                  {selectedOrder?.orderDate
                    ? new Date(selectedOrder?.orderDate).toLocaleString('pt-PT')
                    : '-'}
                </Text>
              ) : (
                <Input
                  id="order_date"
                  name="order_date"
                  type="datetime-local"
                  value={
                    values.order_date || new Date().toISOString().split('.')[0]
                  }
                  placeholder={'dd/mm/aaaa'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.order_date}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode && !!errors?.fk_address && !!touched?.fk_address
              }
            >
              <FormLabel>Endereço do Cliente</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedOrder?.address
                    ? `${selectedOrder?.address?.name} - ${selectedOrder?.address?.residence}, ${selectedOrder?.address?.city}`
                    : '-'}
                </Text>
              ) : (
                <Select
                  id="fk_address"
                  name="fk_address"
                  isSearchable
                  value={values.fk_address}
                  options={getCustomerAddresses(values.fk_customer) as any}
                  placeholder={'Selecionar enderecço'}
                  isLoading={isLoadingPersons}
                  onChange={(value) => {
                    setFieldValue('fk_address', value);
                  }}
                />
              )}
              {values.fk_customer &&
                getCustomerAddresses(values.fk_customer).length == 0 && (
                  <FormHelperText fontSize="xs">
                    O cliente deve ter um endereço
                  </FormHelperText>
                )}
              <FormErrorMessage>{errors.fk_address}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !isViewMode && !!errors?.fk_employee && !!touched?.fk_employee
              }
            >
              <FormLabel>Funcionário responsável</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedOrder?.employee?.name || '-'}
                </Text>
              ) : (
                <Select
                  id="fk_employee"
                  name="fk_employee"
                  isSearchable
                  value={values.fk_employee}
                  options={employeeOptions as any}
                  placeholder={'Selecionar funcionário'}
                  isLoading={isLoadingPersons}
                  onChange={(value) => {
                    setFieldValue('fk_employee', value);
                  }}
                />
              )}
              <FormErrorMessage>{errors.fk_employee}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl
            mt={6}
            isRequired={!isViewMode}
            isInvalid={!isViewMode && !!errors?.products && !!touched?.products}
          >
            <FormLabel>Produtos</FormLabel>
            {!isViewMode && (
              <Select
                id="products"
                name="products"
                isSearchable
                isMulti
                isDisabled={isEditMode}
                value={values.products}
                options={productOptions as any}
                placeholder={'Selecionar produtos'}
                isLoading={isLoadingProducts}
                onChange={(value: any) => {
                  setFieldValue('products', value);
                }}
              />
            )}

            {values.products?.length > 0 && (
              <Box>
                {values.products.map((pVal: any) => {
                  const product = products?.find(
                    (p) => p.pkProduct == pVal?.value,
                  );
                  if (!product?.pkProduct) return null;
                  console.log({ pVal });

                  return (
                    <OrderProductItem
                      key={product.pkProduct}
                      product={product}
                      quantity={pVal.quantity}
                      disabled={isEditMode || isViewMode}
                      onRemove={(productId) => {
                        const newProducts = values.products?.filter(
                          (p: any) => p.value != productId,
                        );
                        setFieldValue('products', newProducts);
                      }}
                      onChangeQuantity={({ productId, quantity }) => {
                        const newProducts = values.products?.map((p: any) =>
                          p.value == productId ? { ...p, quantity } : p,
                        );
                        setFieldValue('products', newProducts);
                      }}
                    />
                  );
                })}
                <Text></Text>
              </Box>
            )}
          </FormControl>

          {isViewMode && (
            <SimpleGrid mt={6} columns={{ base: 1, md: 2 }} spacing="25px">
              <Box>
                <FormLabel>Data de criação</FormLabel>
                <Text fontWeight="900">
                  {selectedOrder?.createdAt
                    ? new Date(selectedOrder?.createdAt).toLocaleString('pt-PT')
                    : '-'}
                </Text>
              </Box>
              <Box>
                <FormLabel>Última actualização</FormLabel>
                <Text fontWeight="900">
                  {selectedOrder?.updatedAt
                    ? new Date(selectedOrder?.updatedAt).toLocaleString('pt-PT')
                    : '-'}
                </Text>
              </Box>
            </SimpleGrid>
          )}

          <FormControl
            mt={6}
            isInvalid={
              !isViewMode && !!errors?.observation && !!touched.observation
            }
          >
            <FormLabel>Observações</FormLabel>
            {isViewMode ? (
              <Text fontWeight="900">{selectedOrder?.observation || '-'}</Text>
            ) : (
              <Textarea
                id="observation"
                name="observation"
                value={values.observation}
                placeholder={'Notas e/ou detalhes sobre a venda/pedido'}
                onChange={handleChange}
              />
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={4} variant="ghost" onClick={onClose}>
            Fechar
          </Button>

          {!isViewMode && (
            <Button
              colorScheme="teal"
              background="brand.primary"
              isLoading={isLoading || isEditting}
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
