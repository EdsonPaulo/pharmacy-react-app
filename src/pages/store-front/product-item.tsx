import { Badge, Box, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FaShoppingBasket } from 'react-icons/fa';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { formatMoney } from '../../helpers/numberFormat';
import { IProduct } from '../../typescript/types';

interface ProductItemProps {
  product: IProduct;
  quantity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const ProductItem = React.memo(function ProductItem({
  product,
  onIncrement,
  quantity = 0,
  onDecrement,
}: ProductItemProps) {
  return (
    <Flex
      flex={1}
      height={255}
      flexDir="column"
      key={product.pkProduct}
      borderRadius={10}
      borderWidth={1}
      overflow="hidden"
      borderColor={quantity > 0 ? '#47C8BB' : 'blackAlpha.300'}
    >
      <Image w="100%" src={product.image} height={120} objectFit="cover" />

      <Flex
        px={3}
        py={3}
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Text noOfLines={1} color="#3C557A" fontSize="15px" fontWeight="600">
            {product.name}
          </Text>
          <Text noOfLines={1} fontSize="12px" color="gray.700">
            {product.productCategory?.name}
          </Text>
        </Box>

        <Text color="#3C557A" fontSize="18px" fontWeight="600">
          {formatMoney(product.price)}
        </Text>

        <Flex justifyContent="space-between" alignItems="center">
          <Text mt={2} mr={1} fontSize="10px" color="gray.700">
            Val: {new Date(product?.expirationDate).toLocaleDateString('pt-PT')}
          </Text>

          <Flex flex={1} ml={2} alignItems="center" justifyContent="flex-end">
            {product.stock <= 0 ? (
              <Badge
                px={1}
                mt={2}
                borderRadius={4}
                variant="subtle"
                fontSize="8px"
                colorScheme="orange"
              >
                Fora de estoque
              </Badge>
            ) : quantity > 0 ? (
              <Flex mt={2} alignItems="center">
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
                  icon={<FiPlus fontSize="md" />}
                  aria-label="increase"
                  onClick={onIncrement}
                  disabled={quantity >= product.stock}
                />
              </Flex>
            ) : (
              <IconButton
                size="sm"
                icon={<FaShoppingBasket fontSize={18} />}
                aria-label="increase"
                onClick={onIncrement}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
