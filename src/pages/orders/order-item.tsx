import {
  Badge,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import { formatMoney } from '../../helpers/numberFormat';
import { IOrder } from '../../typescript/types';

interface OrderItemProps {
  order: IOrder;
  hideActions?: boolean;
  onEdit?: (order: IOrder) => void;
  onView?: (order: IOrder) => void;
  onDelete?: (order: IOrder) => void;
}

const statusColorScheme = {
  progress: 'blue',
  success: 'green',
  pending: 'orange',
  cancelled: 'red',
};

export const OrderItem = React.memo(function OrderItem({
  order,
  hideActions,
  onEdit,
  onView,
  onDelete,
}: OrderItemProps) {
  return (
    <Flex
      p={4}
      flex={1}
      height={170}
      flexDir="column"
      key={order.pkOrder}
      borderRadius={6}
      borderWidth={1}
      borderColor="blackAlpha.300"
      justifyContent="space-between"
    >
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Box flex={1} mr={2}>
          <Text noOfLines={2} color="#3C557A" fontSize="16px" fontWeight="600">
            {order.products?.[0]?.name}
          </Text>

          {order.products.length > 1 && (
            <Text fontSize="13px" color="gray.700">
              + {order.products.length - 1} produto
              {order.products.length > 2 ? 's' : ''}
            </Text>
          )}
        </Box>

        {!hideActions && (
          <Menu>
            <MenuButton
              as={IconButton}
              variant="outline"
              aria-label="Ações"
              icon={<BsThreeDotsVertical />}
            />
            <MenuList>
              <MenuItem icon={<FiEye />} onClick={() => onView?.(order)}>
                Visualizar
              </MenuItem>
              <MenuItem icon={<FiEdit />} onClick={() => onEdit?.(order)}>
                Editar
              </MenuItem>
              <MenuItem icon={<FiTrash2 />} onClick={() => onDelete?.(order)}>
                Eliminar
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>

      <Text color="#3C557A" fontSize="18px" fontWeight="600" textAlign="center">
        {formatMoney(order.total)}
      </Text>

      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1} mr={2}>
          <Text color="#3C557A" fontSize="14px" fontWeight="600">
            {order.customer?.name}
          </Text>
          <Text fontSize="12px" color="gray.700">
            {order?.customer?.email}
          </Text>
        </Box>

        <Box>
          <Badge
            px={1}
            borderRadius={4}
            variant="subtle"
            fontSize="11px"
            colorScheme={statusColorScheme.progress}
          >
            Completa
          </Badge>

          <Text ml={1} fontSize="11px" color="gray.700">
            {new Date(order?.orderDate ?? order?.createdAt).toLocaleDateString(
              'pt-PT',
            )}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
});
