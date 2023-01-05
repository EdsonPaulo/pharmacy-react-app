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
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { IEmployee } from '../../typescript/types';

interface EmployeesListProps {
  isLoading: boolean;
  isEmpty: boolean;
  employees?: IEmployee[];
  onAddNew: () => void;
  onView: (employee: IEmployee) => void;
  onEdit: (employee: IEmployee) => void;
}

export const EmployeesList = ({
  employees = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
}: EmployeesListProps) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee>();

  const onDelete = useCallback(
    (employee: IEmployee) => {
      setSelectedEmployee(employee);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    // delete employee
    onClose();
  }, [onClose]);

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
                Funcionários
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
                    <Th>Criado em</Th>
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
                    {employees?.map((c) => (
                      <Tr key={c.pkEmployee}>
                        <Td>{c.pkEmployee}</Td>
                        <Td>{c?.name}</Td>
                        <Td>{c.email ?? '-'}</Td>
                        <Td>{c.phone ?? '-'}</Td>
                        <Td>
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString('pt-BR')
                            : '-'}
                        </Td>
                        <Td>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="visualizar"
                            icon={<FiEye />}
                            onClick={() => onView(c)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="editar"
                            icon={<FiEdit />}
                            onClick={() => onEdit(c)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="deletar"
                            icon={<FiTrash2 />}
                            onClick={() => onDelete(c)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot></Tfoot>
                    {employees?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de funcionários no sistema
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
              <b> {selectedEmployee?.name}</b>?
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
