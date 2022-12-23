import { Box, Flex } from '@chakra-ui/react';
import { SidebarMenu } from '../components/sidebar-menu';
import { AuthenticatedRoutes } from '../routes';

export const App = () => {
  return (
    <Flex position="relative">
      <SidebarMenu />
      <Box ml={280} flex={1} minHeight="100vh">
        <AuthenticatedRoutes />
      </Box>
    </Flex>
  );
};
