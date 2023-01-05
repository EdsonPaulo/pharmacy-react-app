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
import { IProduct } from '../../../typescript/types';

interface ProductsTableProps {
  isLoading: boolean;
  isEmpty: boolean;
  products?: IProduct[];
  onAddNew: () => void;
  onView: (product: IProduct) => void;
  onEdit: (product: IProduct) => void;
}

export const ProductsTable = ({
  products = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
}: ProductsTableProps) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProducts, setSelectedProducts] = useState<IProduct>();

  const onDelete = useCallback(
    (product: IProduct) => {
      setSelectedProducts(product);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    // delete product
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
                Produtos
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
                    <Th>Categoria</Th>
                    <Th>Preço</Th>
                    <Th>Data Expiração</Th>
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
                    {products?.map((p) => (
                      <Tr key={p.pkProduct}>
                        <Td>{p.pkProduct}</Td>
                        <Td>{p?.name}</Td>
                        <Td>{p.productCategory?.name}</Td>
                        <Td>{p.price}</Td>
                        <Td>
                          {new Date(p.expirationDate).toLocaleDateString(
                            'pt-PT',
                          )}
                        </Td>
                        <Td>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="visualizar"
                            icon={<FiEye />}
                            onClick={() => onView(p)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="editar"
                            icon={<FiEdit />}
                            onClick={() => onEdit(p)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="deletar"
                            icon={<FiTrash2 />}
                            onClick={() => onDelete(p)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot></Tfoot>
                    {products?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de produtos no sistema
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
              Eliminar Produto
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja eliminar o produto
              <b> {selectedProducts?.name}</b>?
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
