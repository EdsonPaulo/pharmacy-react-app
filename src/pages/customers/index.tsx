import { Box, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const CustomersPage = () => {
  const { pathname } = useLocation();

  return (
    <Box flex={1}>
      <Box />
      <h1>CLIENTES</h1>
    </Box>
  );
};
