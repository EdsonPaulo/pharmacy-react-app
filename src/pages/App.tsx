import { Box, Flex } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { SidebarMenu } from '../components/sidebar-menu';
import { AuthenticatedRoutes } from '../routes';

export const App = () => {
  return (
    <Flex position="relative">
      <SidebarMenu />
      <ColorModeSwitcher position="absolute" right={5} top={5} />
      <Box flex={1} minHeight="100vh">
        <AuthenticatedRoutes />
      </Box>
    </Flex>
  );
};
