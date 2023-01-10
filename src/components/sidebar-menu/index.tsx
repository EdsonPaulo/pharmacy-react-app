import { Box, Flex, Icon, Image, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { AdminMenu } from './menu-items';

export const SidebarMenu = () => {
  const { pathname } = useLocation();

  return (
    <Flex
      width={280}
      height="100vh"
      textColor="white"
      bgColor="brand.primary"
      flexDirection="column"
      position="fixed"
      zIndex={2}
      justifyContent="space-between"
    >
      <Box>
        <Flex mb={10} mt={6} p={10}>
          <Link as={RouterLink} to={ROUTES.Dashboard}>
            <Image src="/farm-gest-logo.svg" alt="farm gest logo" />
          </Link>
        </Flex>

        {AdminMenu.map((item) => (
          <Box key={item.title} mb={12} pl={10}>
            <Text
              mb={3}
              fontSize={12}
              textTransform="uppercase"
              fontFamily="Roboto"
              fontWeight="900"
              letterSpacing={1.2}
            >
              {item.title}
            </Text>

            {item.children.map((menuItem) => (
              <Link
                key={menuItem.title}
                as={RouterLink}
                to={menuItem.path}
                textDecoration="none"
              >
                <Flex
                  mb={2}
                  py={2}
                  px={4}
                  alignItems="center"
                  cursor={'pointer'}
                  borderBottomLeftRadius={6}
                  borderTopLeftRadius={6}
                  bg={
                    menuItem.path === pathname
                      ? 'brand.primaryDark'
                      : 'brand.primary'
                  }
                  _hover={{ background: 'brand.primaryDark' }}
                >
                  <Icon mr={3} as={menuItem.icon} boxSize={5} color="white" />
                  <Text
                    fontWeight="600"
                    fontSize={13}
                    letterSpacing={1.1}
                    textTransform={'capitalize'}
                  >
                    {menuItem.title}
                  </Text>
                </Flex>
              </Link>
            ))}
          </Box>
        ))}
      </Box>
    </Flex>
  );
};
