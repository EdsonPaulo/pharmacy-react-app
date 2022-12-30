import { Box, Flex } from '@chakra-ui/react';
import { HeaderBar } from '../components/header-bar';
import { SidebarMenu } from '../components/sidebar-menu';
import { AuthenticatedRoutes } from '../routes';

export const App = () => {
  return (
    <Flex position="relative">
      <SidebarMenu />

      <Box ml={280} pt={8} flex={1} minHeight="100vh">
        <HeaderBar />

        <AuthenticatedRoutes />
      </Box>
    </Flex>
  );
};
