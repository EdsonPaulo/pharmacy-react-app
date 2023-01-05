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
import { ICustomer } from '../../typescript/types';

interface CustomersListProps {
  isLoading: boolean;
  isEmpty: boolean;
  customers?: ICustomer[];
  onAddNew: () => void;
  onView: (customer: ICustomer) => void;
  onEdit: (customer: ICustomer) => void;
}

export const CustomersList = ({
  customers = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
}: CustomersListProps) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>();

  const onDelete = useCallback(
    (customer: ICustomer) => {
      setSelectedCustomer(customer);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    // delete customer
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
                Clientes
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
                    {customers?.map((c) => (
                      <Tr key={c.pkCustomer}>
                        <Td>{c.pkCustomer}</Td>
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
                    {customers?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de clientes no sistema
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
              Eliminar cliente
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja eliminar o cliente
              <b> {selectedCustomer?.name}</b>?
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