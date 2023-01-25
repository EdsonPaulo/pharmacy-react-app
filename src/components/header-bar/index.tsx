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
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useCallback, useRef } from 'react';
import { AiOutlinePoweroff, AiOutlineEdit } from 'react-icons/ai';
import { FiSettings, FiChevronDown } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/useAuth';
import { UserTypesMap } from '../../pages/users/users.helpers';
import { UserTypeEnum } from '../../typescript/enums';

export const HeaderBar = () => {
  const { user, handleLogout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handlePressLogout = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleConfirmClose = useCallback(() => {
    onClose();
    handleLogout();
  }, [handleLogout, onClose]);

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
      borderBottomWidth={1}
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

            <Link as={RouterLink} to={ROUTES.Profile} textDecoration="none">
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
            </Link>
          </Box>

          <MenuDivider />

          {user.userType !== UserTypeEnum.CUSTOMER && (
            <Link as={RouterLink} to={ROUTES.Preferences} textDecoration="none">
              <MenuItem icon={<FiSettings size={16} />} fontSize="sm">
                Configurações
              </MenuItem>
            </Link>
          )}

          <MenuItem
            fontSize="sm"
            icon={<AiOutlinePoweroff size={16} />}
            onClick={handlePressLogout}
          >
            Terminar Sessão
          </MenuItem>
        </MenuList>
      </Menu>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef as any}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Terminar Sessão
            </AlertDialogHeader>

            <AlertDialogBody>Deseja terminar a sessão e sair?</AlertDialogBody>

            <AlertDialogFooter>
              <Button mr={3} ref={cancelRef as any} onClick={onClose}>
                Não
              </Button>
              <Button colorScheme="red" onClick={handleConfirmClose}>
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};
