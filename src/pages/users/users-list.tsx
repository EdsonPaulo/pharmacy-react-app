import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useMutation } from 'react-query';
import { deleteUser } from '../../services/users';
import { IUser } from '../../typescript/types';
import { UserTypesMap } from './users.helpers';

interface UsersListProps {
  isLoading: boolean;
  isEmpty: boolean;
  users?: IUser[];
  onAddNew: () => void;
  onRefetch: () => void;
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
}

export const UsersList = ({
  users = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
  onRefetch,
}: UsersListProps) => {
  const cancelRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const { mutate, isLoading: isDeletting } = useMutation(
    'delete-user',
    deleteUser,
  );

  const onDelete = useCallback(
    (user: IUser) => {
      setSelectedUser(user);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    if (selectedUser) {
      mutate(selectedUser?.pkUser, {
        onSuccess: () => {
          toast({
            duration: 2000,
            position: 'top-right',
            variant: 'subtle',
            status: 'success',
            title: 'Utilizador elimidado com sucesso!',
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
              'Ocorreu um erro ao eliminar utilizador!',
          });
        },
      });
    }
  }, [mutate, onClose, onRefetch, selectedUser, toast]);

  return (
    <Flex p={10} alignItems="center">
      <Box
        borderWidth={1}
        borderRadius={8}
        width="100%"
        minH={400}
        borderColor="blackAlpha.100"
      >
        {isLoading ? (
          <Center minH={400}>
            <Spinner
              size="xl"
              emptyColor="gray.200"
              color="brand.primary"
              thickness="3px"
            />
          </Center>
        ) : (
          <Box>
            <Flex justifyContent="space-between" p={6} alignItems="center">
              <Heading as="h1" fontSize={18} color="brand.primary">
                Utilizadores
              </Heading>

              <Button
                variant="outline"
                size="md"
                color="brand.primary"
                leftIcon={<FiPlus />}
                onClick={onAddNew}
              >
                Adicionar
              </Button>
            </Flex>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr bg="#C4C4C4">
                    <Th>#</Th>
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>Tipo</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>

                {isEmpty ? (
                  <Th colSpan={4}>
                    <Center minH={350}>
                      <Text color="blackAlpha.500" textAlign="center">
                        Sem dados para mostrar!
                      </Text>
                    </Center>
                  </Th>
                ) : (
                  <Tbody>
                    {users?.map((u) => (
                      <Tr key={u.pkUser}>
                        <Td>{u.pkUser}</Td>
                        <Td>
                          {u?.personalInfo?.name ?? u?.email?.split?.('@')?.[0]}
                        </Td>
                        <Td>{u.email}</Td>
                        <Td>{UserTypesMap[u.userType]}</Td>
                        <Td>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="visualizar"
                            icon={<FiEye />}
                            onClick={() => onView(u)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="editar"
                            icon={<FiEdit />}
                            onClick={() => onEdit(u)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="deletar"
                            icon={<FiTrash2 />}
                            onClick={() => onDelete(u)}
                            isLoading={
                              isDeletting && u.pkUser === selectedUser?.pkUser
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot></Tfoot>
                    {users?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de utilizadores no sistema
                      </TableCaption>
                    )}
                  </>
                )}
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef as any}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Utilizador
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja eliminar o utilizador
              <b> {selectedUser?.personalInfo?.name}</b>?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button mr={3} ref={cancelRef as any} onClick={onClose}>
                Não
              </Button>
              <Button colorScheme="red" onClick={handleConfirmClose}>
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};
