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
import { formatMoney } from '../../helpers/numberFormat';
import { deleteOrder } from '../../services/orders';
import { IOrder } from '../../typescript/types';

interface OrdersListProps {
  isLoading: boolean;
  isEmpty: boolean;
  orders?: IOrder[];
  onAddNew: () => void;
  onRefetch: () => void;
  onView: (order: IOrder) => void;
  onEdit: (order: IOrder) => void;
}

export const OrdersList = ({
  orders = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
  onRefetch,
}: OrdersListProps) => {
  const cancelRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<IOrder>();
  const { mutate, isLoading: isDeletting } = useMutation(
    'delete-order',
    deleteOrder,
  );

  const onDelete = useCallback(
    (order: IOrder) => {
      setSelectedOrder(order);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    if (selectedOrder) {
      mutate(selectedOrder?.pkOrder, {
        onSuccess: () => {
          toast({
            duration: 2000,
            position: 'top-right',
            variant: 'subtle',
            status: 'success',
            title: 'Venda elimidada com sucesso!',
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
              'Ocorreu um erro ao eliminar venda!',
          });
        },
      });
    }
  }, [mutate, onClose, onRefetch, selectedOrder, toast]);

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
                Vendas
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
                    <Th>Data do pedido</Th>
                    <Th>Total</Th>
                    <Th>Cliente</Th>
                    <Th></Th>
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
                    {orders?.map((o) => (
                      <Tr key={o.pkOrder}>
                        <Td>{o.pkOrder}</Td>
                        <Td>
                          {o?.orderDate
                            ? new Date(o?.orderDate).toLocaleDateString('pt-PT')
                            : '-'}
                        </Td>
                        <Td>{formatMoney(o.total)}</Td>
                        <Td>{o?.customer?.name ?? '-'}</Td>
                        <Td>{o?.address?.residence}</Td>
                        <Td>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="visualizar"
                            icon={<FiEye />}
                            onClick={() => onView(o)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="editar"
                            icon={<FiEdit />}
                            onClick={() => onEdit(o)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="deletar"
                            icon={<FiTrash2 />}
                            isLoading={
                              isDeletting &&
                              o.pkOrder === selectedOrder?.pkOrder
                            }
                            onClick={() => onDelete(o)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot></Tfoot>
                    {orders?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de vendas no sistema
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
              Eliminar venda
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja eliminar a venda
              <b> #{selectedOrder?.pkOrder}</b>?
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
