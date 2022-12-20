import { Box, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const OrdersPage = () => {
  const { pathname } = useLocation();

  return (
    <Box flex={1}>
      <Box />
      <h1>ENCOMENDAS</h1>
    </Box>
  );
};
