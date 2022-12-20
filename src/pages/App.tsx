import { Box, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { SidebarMenu } from '../components/sidebar-menu';
import { Router } from '../routes';

export const App = () => {
  const { pathname } = useLocation();

  const isAdmin = useMemo(() => pathname.includes('admin'), [pathname]);

  return (
    <Flex position="relative">
      <SidebarMenu />
      <ColorModeSwitcher position="absolute" right={5} top={5} />
      <Box flex={1} minHeight="100vh">
        <Router />
      </Box>
    </Flex>
  );
};
