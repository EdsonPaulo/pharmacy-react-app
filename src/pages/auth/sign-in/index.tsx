import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/useAuth';

export const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSignIn, isLoading, formData, handleChangeFormData } = useAuth();

  return (
    <Flex minH="100vh" bg="brand.primary">
      <Box flex={1} p={4} display={{ base: 'none', md: 'block' }}>
        <Box
          minH="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image src="/farm-gest-logo.svg" />
        </Box>
      </Box>

      <Flex
        bg="white"
        flex={{ base: 1, md: 0.5 }}
        p={{ base: 5, md: 10, lg: 20 }}
        alignItems="center"
      >
        <Box w="100%">
          <Text fontSize="2xl" as="b">
            Entrar agora na conta
          </Text>

          <Box h="4px" w="35px" bg="brand.primary" mt={1} mb={5} />

          <Text mb={1}>Email</Text>
          <Input
            size="md"
            required
            value={formData.email}
            placeholder="utilizador@email.com"
            inputMode="email"
            onChange={({ target: { value } }) =>
              handleChangeFormData({ email: value })
            }
          />

          <Box mt={4} mb={7}>
            <Text mb={1}>Palavra-passe</Text>
            <InputGroup size="md">
              <Input
                size="md"
                required
                value={formData.password}
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                onChange={({ target: { value } }) =>
                  handleChangeFormData({ password: value })
                }
              />
              <InputRightElement>
                <IconButton
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={'mostrar palavra-passe'}
                />
              </InputRightElement>
            </InputGroup>
          </Box>

          <Button
            w="100%"
            color="white"
            variant="solid"
            colorScheme="teal"
            isLoading={isLoading}
            disabled={!formData?.email || !formData?.password}
            onClick={() => handleSignIn()}
          >
            Entrar agora
          </Button>

          <Text mt={10} textAlign="center">
            Não tem uma conta?
            <Link
              ml={2}
              as={RouterLink}
              to="/criar-conta"
              color="brand.primary"
            >
              Criar uma conta
            </Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
