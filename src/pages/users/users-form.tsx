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
  useToast,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useMutation } from 'react-query';
import { postCreateUser } from '../../services/users';
import { useFormik } from 'formik';
import { newUserSchema, UserTypesMap } from './users.helpers';
import { UserTypeEnum } from '../../types/enums';

interface UsersFormProps {
  onClose: () => void;
}

export const UsersForm = ({ onClose }: UsersFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddUser } = useMutation(
    'create-user',
    postCreateUser,
  );

  const { handleSubmit, isValid, errors, touched, handleChange, resetForm } =
    useFormik({
      validationSchema: newUserSchema,
      enableReinitialize: true,
      validateOnMount: true,
      validateOnChange: true,
      initialValues: {
        name: '',
        email: '',
        password: '',
        user_type: null,
      },
      onSubmit: (values) => {
        mutateAddUser(values, {
          onSuccess: () => {
            resetForm();
            toast({
              duration: 2000,
              position: 'top-right',
              variant: 'subtle',
              status: 'success',
              title: 'Utilizador criado com sucesso!',
            });
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
    () => isLoading || !isValid,
    [isLoading, isValid],
  );
  console.log(errors, touched);

  return (
    <form onSubmit={handleSubmit}>
      <ModalContent>
        <ModalHeader>Novo Usuário</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="15px">
            <FormControl
              isInvalid={!!errors?.name && !!touched.name}
              isRequired
            >
              <FormLabel>Nome Completo</FormLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="ex.: John Doe"
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
                placeholder="utilizador@email.com"
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                placeholder="********"
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={!!errors?.user_type && !!touched.user_type}
            >
              <FormLabel>Tipo de Usuário</FormLabel>
              <Select
                id="user_type"
                name="user_type"
                placeholder="Selecione um opção"
                onChange={handleChange}
              >
                {Object.values(UserTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {UserTypesMap[type]}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
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
            isLoading={isLoading}
            disabled={isAddButtonDisabled}
            type="submit"
          >
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </form>
  );
};
