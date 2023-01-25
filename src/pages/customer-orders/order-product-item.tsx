import { Box, Center, Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import { formatMoney } from '../../helpers/numberFormat';
import { IProduct } from '../../typescript/types';

interface OrderProductItemProps {
  product: IProduct;
  quantity: number;
  stock: number;
  disabled?: boolean;
  onRemove: (productId: number) => void;
  onChangeQuantity: (args: { productId: number; quantity: number }) => void;
}
export const OrderProductItem = React.memo(function OrderProductItem({
  quantity: defaultQuantity = 1,
  stock = 1,
  product,
  onRemove,
  disabled,
  onChangeQuantity,
}: OrderProductItemProps) {
  const [quantity, setQuantity] = useState(defaultQuantity);

  const handleRemove = useCallback(() => {
    onRemove(product.pkProduct);
  }, [onRemove, product.pkProduct]);

  const handleIncreaseQuantity = useCallback(() => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onChangeQuantity({
      productId: product.pkProduct,
      quantity: newQuantity,
    });
  }, [onChangeQuantity, product.pkProduct, quantity]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity === 1) {
      handleRemove();
    } else {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChangeQuantity({
        productId: product.pkProduct,
        quantity: newQuantity,
      });
    }
  }, [handleRemove, onChangeQuantity, product.pkProduct, quantity]);

  return (
    <Box pt={3} px={disabled ? 0 : 2}>
      <Center>
        {!disabled && (
          <IconButton
            size="sm"
            variant="ghost"
            icon={<FiX />}
            aria-label="adicionar"
            onClick={handleRemove}
            colorScheme="red"
          />
        )}

        <Box flex={1} mx={disabled ? 0 : 2}>
          <Flex alignItems="center">
            <Text mr={2}>{product.name}</Text>
            <Text fontSize="xs" textColor="gray.500">
              ({stock} disponíve{stock === 1 ? 'l' : 'is'})
            </Text>
          </Flex>

          <Text
            fontSize="sm"
            color="gray.900"
            fontWeight={disabled ? 'bold' : 'normal'}
          >
            {formatMoney(product.price * quantity)}
          </Text>
        </Box>

        {disabled ? (
          <Text mx={4}>X{quantity}</Text>
        ) : (
          <Center>
            <IconButton
              size="sm"
              variant="outline"
              icon={<FiMinus />}
              aria-label="retirar"
              onClick={handleDecreaseQuantity}
            />
            <Text mx={4}>{quantity}</Text>
            <IconButton
              size="sm"
              variant="outline"
              icon={<FiPlus />}
              aria-label="adicionar"
              disabled={quantity >= stock}
              onClick={handleIncreaseQuantity}
            />
          </Center>
        )}
      </Center>

      <Box
        mt={3}
        mx={disabled ? 0 : 2}
        borderBottomWidth={1}
        borderColor="grey.200"
      />
    </Box>
  );
});
