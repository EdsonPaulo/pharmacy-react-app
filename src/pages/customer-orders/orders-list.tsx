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
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useMutation } from 'react-query';
import { cancelOrder } from '../../services/orders';
import { IOrder } from '../../typescript/types';
import { OrderItem } from './order-item';

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
    'cancel-order',
    cancelOrder,
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
            title: 'Compra cancelada com sucesso!',
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
              'Ocorreu um erro ao cancelar compra!',
          });
        },
      });
    }
  }, [mutate, onClose, onRefetch, selectedOrder, toast]);

  return (
    <Flex width={'100%'} p={10} alignItems="center">
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
        <Box width="100%">
          <Flex mb={6} justifyContent="space-between" alignItems="center">
            <Heading as="h1" fontSize={18} color="brand.primary">
              Minhas Compras
            </Heading>

            <Button
              variant="outline"
              size="md"
              color="brand.primary"
              leftIcon={<FiPlus />}
              onClick={onAddNew}
            >
              Nova Compra
            </Button>
          </Flex>

          {isEmpty ? (
            <Center minH={350}>
              <Text color="blackAlpha.500" textAlign="center">
                Sem dados para mostrar!
              </Text>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px">
              {orders?.map((o) => (
                <OrderItem
                  order={o}
                  key={o.pkOrder}
                  onEdit={onEdit}
                  onView={onView}
                  onDelete={onDelete}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef as any}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancelar compra
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja cancelar a compra
              <b> #0000{selectedOrder?.pkOrder}</b>?
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
