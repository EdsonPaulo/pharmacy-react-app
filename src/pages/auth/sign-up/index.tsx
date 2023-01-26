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

export const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSignUp, isLoading, formData, handleChangeFormData } = useAuth();

  return (
    <form>
      <Flex minH="100vh" bg="brand.primary">
        <Box flex={1} display={{ xs: 'none', md: 'block' }}>
          <Box
            minH="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src="/farm-gest-logo.svg" />
          </Box>
        </Box>

        <Flex bg="white" flex={0.5} p={20} alignItems="center">
          <Box w="100%">
            <Text fontSize="2xl" as="b">
              Criar Conta
            </Text>

            <Box h="4px" w="35px" bg="brand.primary" mt={1} mb={4} />

            <Text mb={1}>Nome e Sobrenome</Text>
            <Input
              size="md"
              required
              value={formData.name}
              placeholder="Utilizador Exemplo"
              inputMode="text"
              type="text"
              autoComplete="none"
              onChange={({ target: { value } }) =>
                handleChangeFormData({ name: value })
              }
            />

            <Text mt={3} mb={1}>
              Email
            </Text>
            <Input
              size="md"
              required
              type="email"
              value={formData.email}
              placeholder="utilizador@email.com"
              inputMode="email"
              role="presentation"
              autoComplete="off"
              onChange={({ target: { value } }) =>
                handleChangeFormData({ email: value })
              }
            />

            <Text mt={3} mb={1}>
              Palavra-passe
            </Text>
            <InputGroup size="md">
              <Input
                size="md"
                required
                value={formData.password}
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                autoComplete="new-password"
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

            <Button
              mt={6}
              w="100%"
              color="white"
              variant="solid"
              colorScheme="teal"
              isLoading={isLoading}
              disabled={
                !formData?.name || !formData?.email || !formData?.password
              }
              onClick={() => handleSignUp()}
            >
              Criar conta
            </Button>

            <Text mt={10} textAlign="center">
              Já tem uma conta?
              <Link ml={2} as={RouterLink} to="/entrar" color="brand.primary">
                Entrar
              </Link>
            </Text>
          </Box>
        </Flex>
      </Flex>
    </form>
  );
};
