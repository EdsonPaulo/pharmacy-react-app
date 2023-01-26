import { Box, Divider, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { formatMoney } from '../../helpers/numberFormat';
import { IProduct } from '../../typescript/types';

interface ProductCartItemProps {
  product: IProduct;
  quantity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const ProductCartItem = React.memo(function ProductCartItem({
  product,
  onIncrement,
  quantity = 0,
  onDecrement,
}: ProductCartItemProps) {
  return (
    <Box key={product.pkProduct}>
      <Flex alignItems="center">
        <Image
          width={'70px'}
          height={'60px'}
          borderRadius="lg"
          src={product.image}
          objectFit="contain"
          background="gray.100"
        />

        <Box flex={1} ml={2} mr={1}>
          <Text fontSize={14} fontWeight="600">
            {product.name}
          </Text>
          <Text fontSize={14}>{formatMoney(product.price * quantity)}</Text>
        </Box>

        <Flex mt={1} alignItems="center">
          <IconButton
            p={1}
            size="xs"
            aria-label="decrease"
            icon={<FiMinus />}
            onClick={onDecrement}
          />
          <Text mx={2} color="#3C557A" fontSize="14px" fontWeight="600">
            {quantity}
          </Text>
          <IconButton
            p={1}
            size="xs"
            icon={<FiPlus />}
            aria-label="increase"
            onClick={onIncrement}
            disabled={quantity >= product.stock}
          />
        </Flex>
      </Flex>
      <Divider my={3} />
    </Box>
  );
});
