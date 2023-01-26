import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  SimpleGrid,
  Spinner,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  ModalContent,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';

import { useQuery } from 'react-query';
import { formatMoney } from '../../helpers/numberFormat';
import { getProducts } from '../../services/products';
import { IProduct } from '../../typescript/types';
import { OrdersForm } from '../customer-orders/orders-form';
import { ProductCartItem } from './product-cart-item';
import { ProductItem } from './product-item';

interface ICartItem {
  product: IProduct;
  quantity: number;
}

export const StoreFrontPage = () => {
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery('products', getProducts);
  const {
    isOpen: isCartOpen,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure();
  const {
    isOpen: isCheckoutOpen,
    onOpen: onOpenCheckout,
    onClose: onCloseCheckout,
  } = useDisclosure();
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  const isEmpty = useMemo(
    () => !isLoading && products.length === 0,
    [isLoading, products.length],
  );

  const formattedTotalPrice = useMemo(() => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return formatMoney(total);
  }, [cartItems]);

  const handleDecrementQuantity = useCallback((cartItem: ICartItem) => {
    if (cartItem.quantity < 2) {
      setCartItems((prev) =>
        prev.filter(
          (item) => item.product.pkProduct !== cartItem.product.pkProduct,
        ),
      );
    } else {
      setCartItems((prev) => [
        ...prev.map((item) =>
          item.product.pkProduct === cartItem.product.pkProduct
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      ]);
    }
  }, []);

  const handleIncrementQuantity = useCallback(
    (cartItem: ICartItem) => {
      const hasItemOnCart = !!cartItems.find(
        (item) => item.product.pkProduct === cartItem.product.pkProduct,
      );
      setCartItems((prev) =>
        hasItemOnCart
          ? [
              ...prev.map((item) =>
                item.product.pkProduct === cartItem.product.pkProduct
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : item,
              ),
            ]
          : [...prev, { ...cartItem, quantity: 1 }],
      );
    },
    [cartItems],
  );

  return (
    <Flex width={'100%'} my={10} p={10} alignItems="center">
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
          <Flex
            mb={6}
            position={'sticky'}
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading as="h1" fontSize={18} color="brand.primary">
              Vitrine
            </Heading>

            <Button
              size="md"
              variant="outline"
              color="brand.primary"
              leftIcon={<FiShoppingCart />}
              onClick={onOpenCart}
            >
              Carrinho ({cartItems.length})
            </Button>
          </Flex>

          {isEmpty ? (
            <Center minH={350}>
              <Text color="blackAlpha.500" textAlign="center">
                Sem dados para mostrar!
              </Text>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing="20px">
              {products.map((product) => {
                const quantity =
                  cartItems.find(
                    (p) => p.product.pkProduct === product.pkProduct,
                  )?.quantity ?? 0;

                return (
                  <ProductItem
                    product={product}
                    quantity={quantity}
                    key={product.pkProduct}
                    onIncrement={() =>
                      handleIncrementQuantity({ product, quantity })
                    }
                    onDecrement={() =>
                      handleDecrementQuantity({ product, quantity })
                    }
                  />
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      )}

      <Drawer isOpen={isCartOpen} placement="right" onClose={onCloseCart}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Meu Carrinho</DrawerHeader>
          <DrawerBody>
            {cartItems.length === 0 ? (
              <Text mt={10} color="blackAlpha.500" textAlign="center">
                Nenhum produto no carrinho!
              </Text>
            ) : (
              <>
                <Box py={4}>
                  {cartItems.map((cartItem) => (
                    <ProductCartItem
                      product={cartItem.product}
                      quantity={cartItem.quantity}
                      key={cartItem.product.pkProduct}
                      onIncrement={() => handleIncrementQuantity(cartItem)}
                      onDecrement={() => handleDecrementQuantity(cartItem)}
                    />
                  ))}
                </Box>

                <Flex
                  fontWeight="700"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text>Total:</Text>
                  <Text>{formattedTotalPrice}</Text>
                </Flex>
              </>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onCloseCart}
              sx={{ flex: 1 }}
            >
              Fechar
            </Button>
            <Button
              variant="solid"
              colorScheme="teal"
              sx={{ flex: 1 }}
              disabled={cartItems.length === 0}
              onClick={() => {
                onCloseCart();
                onOpenCheckout();
              }}
            >
              Checkout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal
        isOpen={isCheckoutOpen}
        onClose={onCloseCheckout}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '2xl' }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <OrdersForm
            mode="edit"
            onClose={onCloseCheckout}
            onRefetch={() => {
              refetch();
              setCartItems([]);
            }}
            selectedOrder={
              {
                products: cartItems.map((i) => ({
                  ...i.product,
                  productOrder: { quantity: i.quantity },
                })),
              } as any
            }
          />
        </ModalContent>
      </Modal>
    </Flex>
  );
};
