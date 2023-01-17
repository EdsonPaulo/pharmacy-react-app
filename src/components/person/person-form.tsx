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

import { postCreatePerson, putEditPerson } from '../../services/person';
import { useFormik } from 'formik';
import { personSchema } from './person.helpers';
import { IPerson } from '../../typescript/types';
import AngolaCities from '../../constants/angolan-cities.json';
import { UserTypeEnum } from '../../typescript/enums';
import { UserTypesMap } from '../../pages/users/users.helpers';
interface PersonFormProps {
  mode: 'edit' | 'view';
  selectedPerson?: IPerson;
  onClose: () => void;
  onRefetch: () => void;
  personType: UserTypeEnum;
}

export const PersonForm = ({
  selectedPerson,
  mode,
  onClose,
  onRefetch,
  personType,
}: PersonFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddPerson } = useMutation(
    `create-person-${personType}`,
    postCreatePerson,
  );
  const { isLoading: isEditting, mutate: mutateEditPerson } = useMutation(
    `edit-person-${personType}`,
    putEditPerson,
  );

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const isEditMode = useMemo(
    () => mode === 'edit' && !!selectedPerson?.pkPerson,
    [mode, selectedPerson],
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
    status,
    touched,
    handleChange,
    resetForm,
    values,
  } = useFormik({
    validationSchema: personSchema,
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: selectedPerson?.name ?? '',
      email: selectedPerson?.email ?? '',
      bi: selectedPerson?.bi ?? '',
      birth_date: selectedPerson?.birthDate?.split?.('T')?.[0] ?? '',
      phone: selectedPerson?.phone ? Number(selectedPerson?.phone) : '',
      password: '',
      address: selectedPerson?.address
        ? {
            name: selectedPerson?.address?.name ?? '',
            city: selectedPerson?.address?.city ?? '',
            residence: selectedPerson?.address?.residence ?? '',
          }
        : {},
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        address: values?.address?.residence ? values.address : null,
      };
      if (isEditMode && !!selectedPerson) {
        mutateEditPerson(
          {
            person: formData as any,
            personId: selectedPerson?.pkPerson,
            user_type: personType,
          },
          {
            onSuccess: () => {
              resetForm();
              onSuccessExtraCallback('edit');
            },
            onError: (e: any) => {
              onErrorExtraCallback(
                e?.response?.data?.message ??
                  'Ocorreu um erro ao editar funcionário',
              );
            },
          },
        );
      } else {
        mutateAddPerson(formData as any, {
          onSuccess: () => {
            resetForm();
            onSuccessExtraCallback('create');
          },
          onError: (e: any) => {
            onErrorExtraCallback(
              e?.response?.data?.message ??
                'Ocorreu um erro ao criar funcionário',
            );
          },
        });
      }
    },
  });

  console.log(errors, touched, status);

  const isAddButtonDisabled = useMemo(
    () => isLoading || isEditting || !isValid || isViewMode,
    [isEditting, isLoading, isValid, isViewMode],
  );

  return (
    <form onSubmit={handleSubmit}>
      <ModalContent>
        <ModalHeader>
          {isViewMode
            ? selectedPerson?.name
            : isEditMode
            ? `Editar ${
                personType === UserTypeEnum.CUSTOMER ? 'Cliente' : 'Funcionário'
              }`
            : `Novo ${
                personType === UserTypeEnum.CUSTOMER ? 'Cliente' : 'Funcionário'
              }`}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px">
            <FormControl
              isInvalid={!isViewMode && !!errors?.name}
              isRequired={!isViewMode}
            >
              <FormLabel>Nome Completo</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedPerson?.name || '-'} (
                  {UserTypesMap[selectedPerson?.user?.userType ?? personType]})
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
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={!isViewMode && !!errors.email}
            >
              <FormLabel>Email</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedPerson?.email || '-'}</Text>
              ) : (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  disabled={isEditMode}
                  placeholder={'funcionário@email.com'}
                  onChange={handleChange}
                />
              )}
              {isEditMode && (
                <FormHelperText color={'orange.500'} fontSize="xs">
                  Caso queira alterar o email entre em contacto com o suporte!
                </FormHelperText>
              )}
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!isViewMode && !!errors.phone}>
              <FormLabel>Telefone</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedPerson?.phone || '-'}</Text>
              ) : (
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  placeholder={'9XX XXX XXX'}
                  onChange={handleChange}
                  minLength={9}
                  maxLength={9}
                />
              )}

              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!isViewMode && !!errors.bi && !!touched.bi}>
              <FormLabel>Bilhete de identidade</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedPerson?.bi || '-'}</Text>
              ) : (
                <Input
                  id="bi"
                  name="bi"
                  value={values.bi}
                  placeholder={'05LAXXXXXXXXXXX'}
                  onChange={handleChange}
                />
              )}

              <FormErrorMessage>{errors.bi}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!isViewMode && !!errors.birth_date}>
              <FormLabel>Data de nascimento</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedPerson?.birthDate
                    ? new Date(selectedPerson?.birthDate).toLocaleDateString(
                        'pt-PT',
                      )
                    : '-'}
                </Text>
              ) : (
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={values.birth_date}
                  placeholder={'dd/mm/aaaa'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.birth_date}</FormErrorMessage>
            </FormControl>

            {!isViewMode && (
              <FormControl isRequired isInvalid={!!errors?.password}>
                <FormLabel>Palavra-Passe</FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  placeholder={'********'}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
            )}

            {isViewMode && (
              <>
                <Box>
                  <FormLabel>Data de criação</FormLabel>
                  <Text fontWeight="900">
                    {selectedPerson?.createdAt
                      ? new Date(selectedPerson?.createdAt).toLocaleString(
                          'pt-PT',
                        )
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Última actualização</FormLabel>
                  <Text fontWeight="900">
                    {selectedPerson?.updatedAt
                      ? new Date(selectedPerson?.updatedAt).toLocaleString(
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
                  {selectedPerson?.address?.name || '-'}
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
                  {selectedPerson?.address?.city || '-'}
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
                  {selectedPerson?.address?.residence || '-'}
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
