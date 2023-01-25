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
  SimpleGrid,
  Text,
  useToast,
  Divider,
  Select,
  Box,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useMutation } from 'react-query';

import { postCreateSupplier, putEditSupplier } from '../../services/supplier';
import { useFormik } from 'formik';
import { supplierSchema } from './supplier.helpers';
import { ISupplier } from '../../typescript/types';
import AngolaCities from '../../constants/angolan-cities.json';

interface SupplierFormProps {
  mode: 'edit' | 'view';
  selectedSupplier?: ISupplier;
  onClose: () => void;
  onRefetch: () => void;
}

export const SupplierForm = ({
  selectedSupplier,
  mode,
  onClose,
  onRefetch,
}: SupplierFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddSupplier } = useMutation(
    'create-supplier',
    postCreateSupplier,
  );
  const { isLoading: isEditting, mutate: mutateEditSupplier } = useMutation(
    'edit-supplier',
    putEditSupplier,
  );

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const isEditMode = useMemo(
    () => mode === 'edit' && !!selectedSupplier?.pkSupplier,
    [mode, selectedSupplier],
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
        title: `Fornecedor ${
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
    validationSchema: supplierSchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    initialValues: {
      name: selectedSupplier?.name ?? '',
      email: selectedSupplier?.email ?? '',
      nif: selectedSupplier?.nif ?? '',
      phone: selectedSupplier?.phone ?? '',
      address: selectedSupplier?.address
        ? {
            name: selectedSupplier?.address?.name ?? '',
            city: selectedSupplier?.address?.city ?? '',
            residence: selectedSupplier?.address?.residence ?? '',
          }
        : {},
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        address: values?.address?.residence ? values.address : null,
      };
      if (isEditMode && !!selectedSupplier) {
        mutateEditSupplier(
          {
            supplier: formData as any,
            supplierId: selectedSupplier?.pkSupplier,
          },
          {
            onSuccess: () => {
              resetForm();
              onSuccessExtraCallback('edit');
            },
            onError: (e: any) => {
              onErrorExtraCallback(
                e?.response?.data?.message ??
                  'Ocorreu um erro ao editar fornecedor',
              );
            },
          },
        );
      } else {
        mutateAddSupplier(formData as any, {
          onSuccess: () => {
            resetForm();
            onSuccessExtraCallback('create');
          },
          onError: (e: any) => {
            onErrorExtraCallback(
              e?.response?.data?.message ??
                'Ocorreu um erro ao criar fornecedor',
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
    <form onSubmit={handleSubmit} autoComplete="off">
      <ModalContent>
        <ModalHeader>
          {isViewMode
            ? selectedSupplier?.name
            : isEditMode
            ? 'Editar Fornecedor'
            : 'Novo Fornecedor'}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="15px">
            <FormControl
              isInvalid={!isViewMode && !!errors?.name}
              isRequired={!isViewMode}
            >
              <FormLabel>Nome</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedSupplier?.name || '-'}</Text>
              ) : (
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  type="text"
                  autoComplete="none"
                  placeholder={'Nome do fornecedor'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={!isViewMode && !!errors.email}
            >
              <FormLabel>Email</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedSupplier?.email || '-'}</Text>
              ) : (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  role="presentation"
                  autoComplete="off"
                  placeholder={'fornecedor@email.com'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!isViewMode && !!errors.phone}>
              <FormLabel>Telefone</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedSupplier?.phone || '-'}</Text>
              ) : (
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  minLength={9}
                  maxLength={12}
                />
              )}

              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!isViewMode && !!errors.nif && !!touched.nif}
            >
              <FormLabel>NIF</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedSupplier?.nif || '-'}</Text>
              ) : (
                <Input
                  id="nif"
                  name="nif"
                  value={values.nif}
                  onChange={handleChange}
                />
              )}

              <FormErrorMessage>{errors.nif}</FormErrorMessage>
            </FormControl>

            {isViewMode && (
              <>
                <Box>
                  <FormLabel>Data de criação</FormLabel>
                  <Text fontWeight="900">
                    {selectedSupplier?.createdAt
                      ? new Date(selectedSupplier?.createdAt).toLocaleString(
                          'pt-PT',
                        )
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Última actualização</FormLabel>
                  <Text fontWeight="900">
                    {selectedSupplier?.updatedAt
                      ? new Date(selectedSupplier?.updatedAt).toLocaleString(
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
            Endereço
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
                  {selectedSupplier?.address?.name || '-'}
                </Text>
              ) : (
                <Input
                  id="address.name"
                  name="address.name"
                  value={values?.address?.name}
                  placeholder={'ex.: Escritório 1'}
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
                  {selectedSupplier?.address?.city || '-'}
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
                  {selectedSupplier?.address?.residence || '-'}
                </Text>
              ) : (
                <Input
                  id="address.residence"
                  name="address.residence"
                  value={values?.address?.residence}
                  placeholder={'ex.: Av. Deolinda, Apt. B3'}
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
