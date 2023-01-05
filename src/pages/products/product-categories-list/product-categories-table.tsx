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
import { IProductCategory } from '../../../typescript/types';

interface ProductCategoriesTableProps {
  isLoading: boolean;
  isEmpty: boolean;
  productCategories?: IProductCategory[];
  onAddNew: () => void;
  onView: (product: IProductCategory) => void;
  onEdit: (product: IProductCategory) => void;
}

export const ProductCategoriesTable = ({
  productCategories = [],
  isLoading,
  isEmpty,
  onAddNew,
  onView,
  onEdit,
}: ProductCategoriesTableProps) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProducts, setSelectedProducts] = useState<IProductCategory>();

  const onDelete = useCallback(
    (productCategory: IProductCategory) => {
      setSelectedProducts(productCategory);
      onOpen();
    },
    [onOpen],
  );

  const handleConfirmClose = useCallback(() => {
    // delete productCategory
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
                Categorias de produtos
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
                    <Th>Data criação</Th>
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
                    {productCategories?.map((pc) => (
                      <Tr key={pc.pkProductCategory}>
                        <Td>{pc.pkProductCategory}</Td>
                        <Td>{pc?.name}</Td>
                        <Td>
                          {new Date(pc.createdAt).toLocaleDateString('pt-PT')}
                        </Td>
                        <Td>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="visualizar"
                            icon={<FiEye />}
                            onClick={() => onView(pc)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="editar"
                            icon={<FiEdit />}
                            onClick={() => onEdit(pc)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="deletar"
                            icon={<FiTrash2 />}
                            onClick={() => onDelete(pc)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot></Tfoot>
                    {productCategories?.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de categorias de produtos no sistema
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
              Eliminar Categoria
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja eliminar a categoria
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
