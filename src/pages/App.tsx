import { Box, Flex } from '@chakra-ui/react';
import { HeaderBar } from '../components/header-bar';
import { SidebarMenu } from '../components/sidebar-menu';
import { useAuth } from '../contexts/useAuth';
import {
  AuthenticatedAdminRoutes,
  AuthenticatedCustomerRoutes,
} from '../routes';
import { UserTypeEnum } from '../typescript/enums';

export const App = () => {
  const { user } = useAuth();
  return (
    <Flex position="relative">
      <SidebarMenu />

      <Box ml={280} pt={8} flex={1} minHeight="100vh">
        <HeaderBar />

        {user.userType === UserTypeEnum.CUSTOMER ? (
          <AuthenticatedCustomerRoutes />
        ) : (
          <AuthenticatedAdminRoutes />
        )}
      </Box>
    </Flex>
  );
};
