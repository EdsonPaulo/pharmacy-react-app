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
import { deletePurchase } from '../../services/purchase';
import { IPurchase } from '../../typescript/types';

interface PurchasesListProps {
  isLoading: boolean;
  isEmpty: boolean;
  purchases?: IPurchase[];
  onAddNew: () => void;
  onRefetch: () => void;
  onView: (purchase: IPurchase) => void;
  onEdit: (purchase: IPurchase) => void;
}

export const PurchasesList = ({
  purchases = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
  onRefetch,
}: PurchasesListProps) => {
  const cancelRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPurchase, setSelectedPurchase] = useState<IPurchase>();
  const { mutate, isLoading: isDeletting } = useMutation(
    'delete-purchase',
    deletePurchase,
  );

  const onDelete = useCallback(
    (purchase: IPurchase) => {
      setSelectedPurchase(purchase);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    if (selectedPurchase) {
      mutate(selectedPurchase?.pkPurchase, {
        onSuccess: () => {
          toast({
            duration: 2000,
            position: 'top-right',
            variant: 'subtle',
            status: 'success',
            title: 'Entrada elimidada com sucesso!',
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
              'Ocorreu um erro ao eliminar Entrada!',
          });
        },
      });
    }
  }, [mutate, onClose, onRefetch, selectedPurchase, toast]);

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
          <Center minH={400} flex={1}>
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
                Entradas/Compras
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
                    <Th>Produto</Th>
                    <Th>Quantidade</Th>
                    <Th>Fornecedor</Th>
                    <Th>Data</Th>
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
                    {purchases?.map((e) => (
                      <Tr key={e.pkPurchase}>
                        <Td>{e.pkPurchase}</Td>
                        <Td>{e?.product?.name}</Td>
                        <Td>{e.quantity ?? '-'}</Td>
                        <Td>{e.supplier?.name ?? '-'}</Td>
                        <Td>
                          {e.purchaseDate
                            ? new Date(e.purchaseDate).toLocaleDateString(
                                'pt-PT',
                              )
                            : '-'}
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
                              e.pkPurchase === selectedPurchase?.pkPurchase
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
                    {purchases?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de entradas no armazém
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
              Eliminar a compra
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja eliminar o a entrada
              <b> {selectedPurchase?.pkPurchase}</b>?
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
