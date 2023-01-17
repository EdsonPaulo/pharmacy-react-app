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
  Divider,
  Select,
  Box,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useMutation } from 'react-query';
import { postCreateOrder, putEditOrder } from '../../services/orders';
import { useFormik } from 'formik';
import { orderSchema } from './orders.helpers';
import { IOrder } from '../../typescript/types';
import AngolaCities from '../../constants/angolan-cities.json';

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

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const isEditMode = useMemo(
    () => mode === 'edit' && !!selectedOrder?.pkOrder,
    [mode, selectedOrder],
  );

  const luandaCities = useMemo(
    () =>
      AngolaCities?.filter((el) => el?.name?.toLowerCase() === 'luanda')?.[0]
        ?.cities,
    [],
  );

  const onSuccessExtraCallback = useCallback(
    (type: 'edit' | 'create') => {
      toast({
        duration: 2000,
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: `Funcionário ${
          type === 'edit' ? 'editado' : 'criado'
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
    validationSchema: orderSchema,
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: selectedOrder?.customer?.name ?? '',
      address: selectedOrder
        ? {
            name: selectedOrder?.address?.name ?? '',
            city: selectedOrder?.address?.city ?? '',
            residence: selectedOrder?.address?.residence ?? '',
          }
        : {},
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        address: values?.address?.residence ? values.address : null,
      } as any;

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
    () => isLoading || isEditting || !isValid || isViewMode,
    [isEditting, isLoading, isValid, isViewMode],
  );

  return (
    <form onSubmit={handleSubmit}>
      <ModalContent>
        <ModalHeader>
          {isViewMode
            ? `Venda #${selectedOrder?.pkOrder!}`
            : isEditMode
            ? 'Editar Venda'
            : 'Novo Venda'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px">
            <FormControl
              isInvalid={!isViewMode && !!errors?.name && !!touched?.name}
              isRequired={!isViewMode}
            >
              <FormLabel>Nome Completo</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedOrder?.customer?.name || '-'}
                </Text>
              ) : (
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  placeholder={'ex.: John Doe'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>
                {
                  // errors.name
                }
              </FormErrorMessage>
            </FormControl>

            {isViewMode && (
              <>
                <Box>
                  <FormLabel>Data de criação</FormLabel>
                  <Text fontWeight="900">
                    {selectedOrder?.createdAt
                      ? new Date(selectedOrder?.createdAt).toLocaleString(
                          'pt-PT',
                        )
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Última actualização</FormLabel>
                  <Text fontWeight="900">
                    {selectedOrder?.updatedAt
                      ? new Date(selectedOrder?.updatedAt).toLocaleString(
                          'pt-PT',
                        )
                      : '-'}
                  </Text>
                </Box>
              </>
            )}
          </SimpleGrid>

          <Divider my={6} />

          <Text fontWeight="bold" fontSize="md">
            Endereço {isViewMode ? '' : '(opcional)'}
          </Text>
          <SimpleGrid mt={3} columns={{ base: 1, md: 2, lg: 3 }} spacing="15px">
            <FormControl
              isInvalid={
                !isViewMode &&
                !!errors?.address?.name &&
                !!touched?.address?.name
              }
            >
              <FormLabel>Designação</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedOrder?.address?.name || '-'}
                </Text>
              ) : (
                <Input
                  id="address.name"
                  name="address.name"
                  value={values?.address?.name}
                  placeholder={'ex.: Casa da Vila Alice'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors?.address?.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !isViewMode &&
                !!errors?.address?.city &&
                !!touched?.address?.city
              }
            >
              <FormLabel>Cidade</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedOrder?.address?.city || '-'}
                </Text>
              ) : (
                <Select
                  id="address.city"
                  name="address.city"
                  value={values?.address?.city}
                  placeholder={'Selecione uma cidade'}
                  onChange={handleChange}
                >
                  {luandaCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              )}
              <FormErrorMessage>{errors?.address?.city}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !isViewMode &&
                !!errors?.address?.residence &&
                !!touched?.address?.residence
              }
            >
              <FormLabel>Endereço</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedOrder?.address?.residence || '-'}
                </Text>
              ) : (
                <Input
                  id="address.residence"
                  name="address.residence"
                  value={values?.address?.residence}
                  placeholder={'ex.: Av. Deolinda, Casa 92'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors?.address?.residence}</FormErrorMessage>
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
