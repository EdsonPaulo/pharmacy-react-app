import { Box, Flex, Icon, Image, Link, Text } from '@chakra-ui/react';
import { AdminMenu } from './menu-items';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export const SidebarMenu = () => {
  const { pathname } = useLocation();

  return (
    <Box
      p={10}
      pr={0}
      width={280}
      height="100vh"
      textColor="white"
      bgColor="brand.primary"
    >
      <Box mr={6} mb={20}>
        <Image src="/farm-gest-logo.png" alt="farm gest logo" />
      </Box>

      {AdminMenu.map((item) => (
        <Box key={item.title} mb={12}>
          <Text
            mb={3}
            fontWeight="bold"
            fontSize={13}
            textTransform="uppercase"
            letterSpacing={1.1}
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
                <Icon
                  mr={3}
                  as={menuItem.icon}
                  boxSize={5}
                  color="white"
                  textColor={'white'}
                />

                <Text
                  fontWeight="bold"
                  fontSize={16}
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
      <Box />
      <Box />
    </Box>
  );
};
