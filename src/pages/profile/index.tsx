/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMemo } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import AngolaCities from '../../constants/angolan-cities.json';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/useAuth';
import { putEditPerson } from '../../services/person';
import { personSchema } from '../person/person.helpers';
import { UserTypesMap } from '../users/users.helpers';

export const ProfilePage = () => {
  const { user, handleGetUserData } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const { isLoading: isEditting, mutate: mutateEditPerson } = useMutation(
    'edit-my-account',
    putEditPerson,
  );

  const luandaCities = useMemo(
    () =>
      AngolaCities?.filter((el) => el?.name?.toLowerCase() === 'luanda')?.[0]
        ?.cities,
    [],
  );

  const { handleSubmit, isValid, errors, touched, handleChange, values } =
    useFormik({
      validationSchema: personSchema,
      enableReinitialize: true,
      validateOnMount: true,
      validateOnChange: true,
      initialValues: {
        name: user?.personalInfo?.name ?? '',
        email: user?.personalInfo?.email ?? '',
        bi: user?.personalInfo?.bi ?? '',
        birth_date: user?.personalInfo?.birthDate?.split?.('T')?.[0] ?? '',
        phone: user?.personalInfo?.phone ?? '',
        password: '#Abc123456',
        user_type: user?.userType,
        address: user?.personalInfo?.address
          ? {
              name: user?.personalInfo?.address?.name ?? '',
              city: user?.personalInfo?.address?.city ?? '',
              residence: user?.personalInfo?.address?.residence ?? '',
            }
          : {},
      },
      onSubmit: (values) => {
        const formData = {
          ...values,
          password: undefined,
          birth_date: values.birth_date || undefined,
          address: values?.address?.residence ? values.address : null,
        };

        mutateEditPerson(
          {
            person: formData as any,
            personId: user?.personalInfo?.pkPerson,
            user_type: user?.userType,
          } as any,
          {
            onSuccess: () => {
              handleGetUserData();
              toast({
                duration: 2000,
                position: 'top-right',
                variant: 'subtle',
                status: 'success',
                title: 'Dados salvos com sucesso!',
              });
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            },
            onError: (e: any) => {
              toast({
                duration: 3000,
                position: 'top-right',
                variant: 'subtle',
                status: 'error',
                title:
                  e?.response?.data?.message ??
                  'Ocorreu um erro ao editar perfil',
              });
            },
          },
        );
      },
    });

  const isAddButtonDisabled = useMemo(
    () => isEditting || !isValid,
    [isEditting, isValid],
  );

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Box p={10} m={10}>
        <Flex mb={8} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Avatar size="lg" />

            <Box ml={4}>
              <Heading as="h5" fontSize={26}>
                {user?.personalInfo?.name}
              </Heading>
              <Text>{UserTypesMap[user?.userType]}</Text>
            </Box>
          </Flex>

          <Flex fontSize={12}>
            <Box mr={6}>
              <Text mb={1}>Data de criação</Text>
              <Text fontWeight="900">
                {user?.personalInfo?.createdAt
                  ? new Date(user?.personalInfo?.createdAt).toLocaleString(
                      'pt-PT',
                    )
                  : '-'}
              </Text>
            </Box>

            <Box>
              <Text mb={1}>Última actualização</Text>
              <Text fontWeight="900">
                {user?.personalInfo?.updatedAt
                  ? new Date(user?.personalInfo?.updatedAt).toLocaleString(
                      'pt-PT',
                    )
                  : '-'}
              </Text>
            </Box>
          </Flex>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="25px">
          <FormControl isInvalid={!!errors?.name} isRequired>
            <FormLabel>Nome Completo</FormLabel>

            <Input
              id="name"
              name="name"
              value={values.name}
              type="text"
              autoComplete="none"
              placeholder={'Nome e Sobrenome'}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              role="presentation"
              autoComplete="off"
              placeholder={'voce@email.com'}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel>Telefone</FormLabel>

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

            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.bi && !!touched.bi}>
            <FormLabel>Bilhete de identidade</FormLabel>
            <Input
              id="bi"
              name="bi"
              value={values.bi}
              placeholder={'05LAXXXXXXXXXXX'}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.bi}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.birth_date}>
            <FormLabel>Data de nascimento</FormLabel>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              value={values.birth_date}
              placeholder={'dd/mm/aaaa'}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.birth_date}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Divider my={6} />

        <Text fontWeight="bold" fontSize="md">
          Endereço
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
              placeholder={'ex.: Casa da Vila Alice'}
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
              placeholder={'Selecione uma cidade'}
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
              placeholder={'ex.: Av. Deolinda, Casa 92'}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors?.address?.residence}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Flex justifyContent="center" mt={14}>
          <Button
            mr={8}
            variant="ghost"
            sx={{ minW: 170 }}
            onClick={() => navigate(ROUTES.Home)}
          >
            Voltar
          </Button>

          <Button
            sx={{ minW: 170 }}
            colorScheme="teal"
            background="brand.primary"
            isLoading={isEditting}
            disabled={isAddButtonDisabled}
            type="submit"
          >
            Salvar
          </Button>
        </Flex>
      </Box>
    </form>
  );
};
