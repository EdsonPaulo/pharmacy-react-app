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
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useMutation } from 'react-query';
import { postCreateCustomer, putEditCustomer } from '../../services/customers';
import { useFormik } from 'formik';
import { customerSchema } from './customers.helpers';
import { ICustomer } from '../../types/types';
import AngolaCities from '../../constants/angolan-cities.json';

interface CustomersFormProps {
  mode: 'edit' | 'view';
  selectedCustomer?: ICustomer;
  onClose: () => void;
  onRefetch: () => void;
}

export const CustomersForm = ({
  selectedCustomer,
  mode,
  onClose,
  onRefetch,
}: CustomersFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddCustomer } = useMutation(
    'create-customer',
    postCreateCustomer,
  );
  const { isLoading: isEditting, mutate: mutateEditCustomer } = useMutation(
    'edit-customer',
    putEditCustomer,
  );

  const isViewMode = useMemo(() => mode === 'view', [mode]);

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
        title: `Cliente ${type === 'edit' ? 'editado' : 'criado'} com sucesso!`,
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
    validationSchema: customerSchema,
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: selectedCustomer?.name ?? '',
      email: selectedCustomer?.email ?? '',
      bi: selectedCustomer?.bi ?? '',
      birth_date: selectedCustomer?.birthDate ?? '',
      phone: selectedCustomer?.phone ?? '',
      password: selectedCustomer ? '' : '#Abc1234',
      address: selectedCustomer
        ? {
            name: selectedCustomer?.address?.name ?? '',
            city: selectedCustomer?.address?.city ?? '',
            residence: selectedCustomer?.address?.residence ?? '',
          }
        : {},
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        address: values?.address?.residence ? values.address : null,
      };

      if (mode === 'edit' && !!selectedCustomer) {
        mutateEditCustomer(
          { customer: formData, customerId: selectedCustomer?.pkCustomer },
          {
            onSuccess: () => {
              resetForm();
              onSuccessExtraCallback('edit');
            },
            onError: (e: any) => {
              onErrorExtraCallback(
                e?.response?.data?.message ??
                  'Ocorreu um erro ao editar cliente',
              );
            },
          },
        );
      } else {
        mutateAddCustomer(formData, {
          onSuccess: () => {
            resetForm();
            onSuccessExtraCallback('create');
          },
          onError: (e: any) => {
            onErrorExtraCallback(
              e?.response?.data?.message ?? 'Ocorreu um erro ao criar cliente',
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
        <ModalHeader>{mode === 'edit' ? 'Editar' : 'Novo'} Cliente</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px">
            <FormControl
              isInvalid={!!errors?.name && !!touched.name}
              isRequired
            >
              <FormLabel>Nome Completo</FormLabel>
              <Input
                id="name"
                name="name"
                value={values.name}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : 'ex.: John Doe'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={!!errors.email && !!touched.email}
            >
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : 'cliente@email.com'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phone && !!touched.phone}>
              <FormLabel>Telefone</FormLabel>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={values.phone}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : '9XX XXX XXX'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.bi && !!touched.bi}>
              <FormLabel>Bilhete de identidade</FormLabel>
              <Input
                id="bi"
                name="bi"
                value={values.bi}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : '05LAXXXXXXXXXXX'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.bi}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors.birth_date && !!touched.birth_date}
            >
              <FormLabel>Data de nascimento</FormLabel>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                value={values.birth_date}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : 'dd/mm/aaaa'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.birth_date}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={!!errors?.password && !!touched.password}
            >
              <FormLabel>Palavra-Passe</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={values.password}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : '********'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Divider my={6} />

          <Text fontWeight="bold" fontSize="md">
            Endereço (opcional):
          </Text>
          <SimpleGrid mt={3} columns={{ base: 1, md: 2, lg: 3 }} spacing="15px">
            <FormControl
              isInvalid={!!errors?.address?.name && !!touched?.address?.name}
            >
              <FormLabel>Designação</FormLabel>
              <Input
                id="address.name"
                name="address.name"
                value={values?.address?.name}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : 'ex.: Casa da Vila Alice'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors?.address?.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors?.address?.city && !!touched?.address?.city}
            >
              <FormLabel>Cidade</FormLabel>
              <Select
                id="address.city"
                name="address.city"
                value={values?.address?.city}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : 'Selecione uma cidade'}
                onChange={handleChange}
              >
                {luandaCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors?.address?.city}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !!errors?.address?.residence && !!touched?.address?.residence
              }
            >
              <FormLabel>Endereço</FormLabel>
              <Input
                id="address.residence"
                name="address.residence"
                value={values?.address?.residence}
                disabled={isViewMode}
                placeholder={isViewMode ? '' : 'ex.: Av. Deolinda, Casa 92'}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors?.address?.residence}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button mr={4} variant="ghost" onClick={onClose}>
            Cancelar
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
