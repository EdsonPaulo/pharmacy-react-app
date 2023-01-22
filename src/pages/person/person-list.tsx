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
import { deletePerson } from '../../services/person';
import { UserTypeEnum } from '../../typescript/enums';
import { IPerson } from '../../typescript/types';

interface PersonListProps {
  isLoading: boolean;
  isEmpty: boolean;
  persons?: IPerson[];
  personType: UserTypeEnum;
  onAddNew: () => void;
  onRefetch: () => void;
  onView: (person: IPerson) => void;
  onEdit: (person: IPerson) => void;
}

export const PersonList = ({
  persons = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
  onRefetch,
  personType,
}: PersonListProps) => {
  const cancelRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPerson, setSelectedPerson] = useState<IPerson>();
  const { mutate, isLoading: isDeletting } = useMutation(
    `delete-person-${personType}`,
    deletePerson,
  );

  const onDelete = useCallback(
    (person: IPerson) => {
      setSelectedPerson(person);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    if (selectedPerson) {
      mutate(selectedPerson?.pkPerson, {
        onSuccess: () => {
          toast({
            duration: 2000,
            position: 'top-right',
            variant: 'subtle',
            status: 'success',
            title: `${
              personType === UserTypeEnum.CUSTOMER ? 'Cliente' : 'Funcionário'
            } elimidado com sucesso!`,
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
              `Ocorreu um erro ao eliminar ${
                personType === UserTypeEnum.CUSTOMER ? 'cliente' : 'funcionário'
              }!`,
          });
        },
      });
    }
  }, [mutate, onClose, onRefetch, personType, selectedPerson, toast]);

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
                {personType === UserTypeEnum.CUSTOMER
                  ? 'Clientes'
                  : 'Funcionários'}
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
                    <Th>Telefone</Th>
                    <Th>
                      {personType === UserTypeEnum.CUSTOMER
                        ? 'Criado em'
                        : 'Admin?'}
                    </Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>

                {isEmpty ? (
                  <Th colSpan={6}>
                    <Center minH={350}>
                      <Text color="blackAlpha.500" textAlign="center">
                        Sem dados para mostrar!
                      </Text>
                    </Center>
                  </Th>
                ) : (
                  <Tbody>
                    {persons?.map((e) => (
                      <Tr key={e.pkPerson}>
                        <Td>{e.pkPerson}</Td>
                        <Td>{e?.name}</Td>
                        <Td>{e.email ?? '-'}</Td>
                        <Td>{e.phone ?? '-'}</Td>
                        <Td>
                          {personType === UserTypeEnum.CUSTOMER
                            ? e.createdAt
                              ? new Date(e.createdAt).toLocaleDateString(
                                  'pt-BR',
                                )
                              : '-'
                            : e.user?.userType === UserTypeEnum.ADMIN
                            ? 'Sim'
                            : 'Não'}
                        </Td>
                        <Td>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="visualizar"
                            icon={<FiEye />}
                            onClick={() => onView(e)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="editar"
                            icon={<FiEdit />}
                            onClick={() => onEdit(e)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="deletar"
                            icon={<FiTrash2 />}
                            isLoading={
                              isDeletting &&
                              e.pkPerson === selectedPerson?.pkPerson
                            }
                            onClick={() => onDelete(e)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot></Tfoot>
                    {persons?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de
                        {personType === UserTypeEnum.CUSTOMER
                          ? ' clientes '
                          : ' funcionários '}
                        no sistema
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
              Eliminar funcionário
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja eliminar o funcionário
              <b> {selectedPerson?.name}</b>?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                mr={3}
                ref={cancelRef as any}
                disabled={isDeletting}
                onClick={onClose}
              >
                Não
              </Button>
              <Button
                colorScheme="red"
                isLoading={isDeletting}
                onClick={handleConfirmClose}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};
