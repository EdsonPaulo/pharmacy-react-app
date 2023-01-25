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
import { postCreatePurchase, putEditPurchase } from '../../services/purchase';
import { useFormik } from 'formik';
import { purchaseSchema } from './purchases.helpers';
import { IPurchase } from '../../typescript/types';
import { getProducts } from '../../services/products';
import { groupedSelectOptions } from '../../helpers/objectTransform';
import { getSuppliers } from '../../services/supplier';
import { UserTypeEnum } from '../../typescript/enums';
import { getPersons } from '../../services/person';

interface PurchasesFormProps {
  mode: 'edit' | 'view';
  selectedPurchase?: IPurchase;
  onClose: () => void;
  onRefetch: () => void;
}

export const PurchasesForm = ({
  selectedPurchase,
  mode,
  onClose,
  onRefetch,
}: PurchasesFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddPurchase } = useMutation(
    'create-purchase',
    postCreatePurchase,
  );
  const { isLoading: isEditting, mutate: mutateEditPurchase } = useMutation(
    'edit-purchase',
    putEditPurchase,
  );
  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery(
    'suppliers',
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    () => getSuppliers(),
  );
  const { data: employees, isLoading: isLoadingPersons } = useQuery(
    `persons-${UserTypeEnum.EMPLOYEE}`,
    () => getPersons(UserTypeEnum.EMPLOYEE),
  );
  const { data: products, isLoading: isLoadingProducts } = useQuery(
    'products',
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    () => getProducts(),
  );

  const productOptions = useMemo(
    () =>
      groupedSelectOptions(
        products?.map((p) => ({
          label: p.name,
          value: p.pkProduct,
          category: p.productCategory?.name ?? 'Outros',
        })) ?? [],
        'category',
      ),
    [products],
  );

  const employeeOptions = useMemo(
    () => employees?.map((p) => ({ value: p.pkPerson, label: p.name })) ?? [],
    [employees],
  );

  const supplierOptions = useMemo(
    () => suppliers?.map((p) => ({ value: p.pkSupplier, label: p.name })) ?? [],
    [suppliers],
  );

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const isEditMode = useMemo(
    () => mode === 'edit' && !!selectedPurchase?.pkPurchase,
    [mode, selectedPurchase],
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
    validationSchema: purchaseSchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    initialValues: {
      observation: selectedPurchase?.observation ?? '',
      quantity: selectedPurchase?.quantity ?? 1,
      purchase_date: selectedPurchase?.purchaseDate?.split?.('T')?.[0] ?? '',
      fk_product: selectedPurchase?.product
        ? {
            value: selectedPurchase?.product?.pkProduct,
            label: selectedPurchase?.product?.name,
          }
        : null,
      fk_supplier: selectedPurchase?.supplier
        ? {
            value: selectedPurchase?.supplier?.pkSupplier,
            label: selectedPurchase?.supplier?.name,
          }
        : null,
      fk_employee: selectedPurchase?.employee
        ? {
            value: selectedPurchase?.employee?.pkPerson,
            label: selectedPurchase?.employee?.name,
          }
        : null,
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        purchase_date: values.purchase_date || null,
        fk_supplier: values.fk_supplier?.value ?? 0,
        fk_employee: values.fk_employee?.value ?? 0,
        fk_product: values.fk_product?.value ?? 0,
      };
      if (isEditMode && !!selectedPurchase) {
        mutateEditPurchase(
          { purchase: formData, purchaseId: selectedPurchase?.pkPurchase },
          {
            onSuccess: () => {
              resetForm();
              onSuccessExtraCallback('edit');
            },
            onError: (e: any) => {
              onErrorExtraCallback(
                e?.response?.data?.message ??
                  'Ocorreu um erro ao editar entrada',
              );
            },
          },
        );
      } else {
        mutateAddPurchase(formData, {
          onSuccess: () => {
            resetForm();
            onSuccessExtraCallback('create');
          },
          onError: (e: any) => {
            onErrorExtraCallback(
              e?.response?.data?.message ?? 'Ocorreu um erro ao criar entrada',
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
            ? `Entrada #0000${selectedPurchase?.pkPurchase!}`
            : isEditMode
            ? 'Editar Entrada'
            : 'Nova Entrada'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="25px">
            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode && !!errors?.fk_product && !!touched?.fk_product
              }
            >
              <FormLabel>Produto</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedPurchase?.product?.name || '-'}
                </Text>
              ) : (
                <Select
                  id="fk_product"
                  name="fk_product"
                  isSearchable
                  value={values.fk_product}
                  options={productOptions as any}
                  placeholder={'Selecionar produto'}
                  isLoading={isLoadingProducts}
                  onChange={(value) => {
                    setFieldValue('fk_product', value);
                  }}
                />
              )}
              <FormErrorMessage>{errors.fk_product}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!isViewMode && !!errors.quantity}>
              <FormLabel>Quantidade</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedPurchase?.quantity || '-'}
                </Text>
              ) : (
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={values.quantity}
                  placeholder={'0'}
                  onChange={handleChange}
                  maxLength={2}
                />
              )}
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode && !!errors?.fk_supplier && !!touched?.fk_supplier
              }
            >
              <FormLabel>Fornecedor</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedPurchase?.supplier?.name || '-'}
                </Text>
              ) : (
                <Select
                  id="fk_supplier"
                  name="fk_supplier"
                  isSearchable
                  value={values.fk_supplier}
                  options={supplierOptions as any}
                  placeholder={'Selecionar fornecedor'}
                  isLoading={isLoadingSuppliers}
                  onChange={(value) => {
                    setFieldValue('fk_supplier', value);
                    setFieldValue('fk_address', null);
                  }}
                />
              )}
              <FormErrorMessage>{errors.fk_supplier}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode && !!errors?.fk_employee && !!touched?.fk_employee
              }
            >
              <FormLabel>Funcionário responsável</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedPurchase?.employee?.name || '-'}
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

            <FormControl
              isInvalid={
                !isViewMode && !!errors.purchase_date && !!touched.purchase_date
              }
            >
              <FormLabel>Data de Entrada</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedPurchase?.purchaseDate
                    ? new Date(selectedPurchase?.purchaseDate).toLocaleString(
                        'pt-PT',
                      )
                    : '-'}
                </Text>
              ) : (
                <Input
                  id="purchase_date"
                  name="purchase_date"
                  type="datetime-local"
                  value={values.purchase_date}
                  placeholder={'dd/mm/aaaa, 00:00'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.purchase_date}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {isViewMode && (
            <SimpleGrid mt={6} columns={{ base: 1, md: 2 }} spacing="25px">
              <Box>
                <FormLabel>Data de criação</FormLabel>
                <Text fontWeight="900">
                  {selectedPurchase?.createdAt
                    ? new Date(selectedPurchase?.createdAt).toLocaleString(
                        'pt-PT',
                      )
                    : '-'}
                </Text>
              </Box>
              <Box>
                <FormLabel>Última actualização</FormLabel>
                <Text fontWeight="900">
                  {selectedPurchase?.updatedAt
                    ? new Date(selectedPurchase?.updatedAt).toLocaleString(
                        'pt-PT',
                      )
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
              <Text fontWeight="900">
                {selectedPurchase?.observation || '-'}
              </Text>
            ) : (
              <Textarea
                id="observation"
                name="observation"
                value={values.observation}
                placeholder={'Notas e/ou detalhes sobre a compra/entrada'}
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
