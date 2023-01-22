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
import { useCallback, useMemo } from 'react';
import { useMutation } from 'react-query';
import { postCreateUser, putEditUser } from '../../services/users';
import { useFormik } from 'formik';
import { newUserSchema, UserTypesMap } from './users.helpers';
import { UserTypeEnum } from '../../typescript/enums';
import { IUser } from '../../typescript/types';

interface UsersFormProps {
  mode: 'edit' | 'view';
  selectedUser?: IUser;
  onClose: () => void;
  onRefetch: () => void;
}

export const UsersForm = ({
  selectedUser,
  mode,
  onClose,
  onRefetch,
}: UsersFormProps) => {
  const toast = useToast();
  const { isLoading, mutate: mutateAddUser } = useMutation(
    'create-user',
    postCreateUser,
  );
  const { isLoading: isEditting, mutate: mutateEditUser } = useMutation(
    'edit-user',
    putEditUser,
  );

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const isEditMode = useMemo(
    () => mode === 'edit' && !!selectedUser?.pkUser,
    [mode, selectedUser],
  );

  const onSuccessExtraCallback = useCallback(
    (type: 'edit' | 'create') => {
      toast({
        duration: 2000,
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: `Utilizador ${
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
    validationSchema: newUserSchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    initialValues: {
      name: selectedUser?.personalInfo?.name ?? '',
      email: selectedUser?.email ?? '',
      password: '',
      user_type: selectedUser?.userType ?? null,
    },
    onSubmit: (values) => {
      if (isEditMode && !!selectedUser) {
        mutateEditUser(
          {
            user: values as any,
            userId: selectedUser?.pkUser,
          },
          {
            onSuccess: () => {
              resetForm();
              onSuccessExtraCallback('edit');
            },
            onError: (e: any) => {
              onErrorExtraCallback(
                e?.response?.data?.message ??
                  'Ocorreu um erro ao editar utitlizador',
              );
            },
          },
        );
      } else {
        mutateAddUser(values, {
          onSuccess: async () => {
            resetForm();
            onSuccessExtraCallback('create');
          },
          onError: (e: any) => {
            onErrorExtraCallback(
              e?.response?.data?.message ??
                'Ocorreu um erro ao criar utilizador',
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
        <ModalHeader>{selectedUser ? 'Editar' : 'Novo'} Utilizador</ModalHeader>
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
                value={values.name}
                disabled={isViewMode}
                placeholder="ex.: John Doe"
                type="text"
                autoComplete="none"
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
                role="presentation"
                autoComplete="off"
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
                autoComplete="new-password"
                value={values.password}
                disabled={isViewMode}
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
                disabled={isViewMode}
                value={values.user_type as any}
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
            Fechar
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
