import {
  Avatar,
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Icon,
  Button,
} from '@chakra-ui/react';
import { AiOutlinePoweroff, AiOutlineEdit } from 'react-icons/ai';
import { FiSettings, FiChevronDown } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/useAuth';
import { UserTypesMap } from '../../pages/users/users.helpers';

export const HeaderBar = () => {
  const { user, handleLogout } = useAuth();

  return (
    <Flex
      py={4}
      pr={8}
      top={0}
      right={0}
      ml={280}
      zIndex={1}
      width="100%"
      position="fixed"
      alignItems="center"
      background="white"
      justifyContent="flex-end"
    >
      <Avatar size="sm" />

      <Menu>
        <MenuButton>
          <Flex alignItems="center">
            <Box ml={2} cursor="pointer" textAlign="left">
              <Text fontWeight="600" fontSize={14} letterSpacing={1}>
                {user?.personalInfo?.name ?? user?.email?.split?.('@')?.[0]}
              </Text>
              <Text fontWeight="400" fontSize={10}>
                {user?.email}
              </Text>
            </Box>
            <Icon ml={2} boxSize={4} as={FiChevronDown} />
          </Flex>
        </MenuButton>

        <MenuList>
          <Box p={2} textAlign="center">
            <Text fontWeight="600" fontSize={14} letterSpacing={1}>
              {user?.personalInfo?.name ?? user?.email?.split?.('@')?.[0]}
            </Text>
            <Text fontWeight="400" fontSize={12}>
              {UserTypesMap[user?.userType]}
            </Text>
            <Text fontWeight="400" fontSize={12}>
              {user?.email}
            </Text>

            <Button
              mt={3}
              size="sm"
              rounded="3xl"
              fontSize="xs"
              variant="outline"
              rightIcon={<AiOutlineEdit />}
            >
              Editar Perfil
            </Button>
          </Box>

          <MenuDivider />
          <Link as={RouterLink} to={ROUTES.Settings} textDecoration="none">
            <MenuItem icon={<FiSettings size={16} />} fontSize="sm">
              Configurações
            </MenuItem>
          </Link>

          <MenuItem
            fontSize="sm"
            icon={<AiOutlinePoweroff size={16} />}
            onClick={() => handleLogout()}
          >
            Terminar Sessão
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
