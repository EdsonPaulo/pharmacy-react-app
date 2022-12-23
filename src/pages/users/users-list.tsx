import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { FiPlus } from 'react-icons/fi';
import { getUsers } from '../../services/users';
import { useMemo } from 'react';

export const UsersList = () => {
  const { data, isLoading } = useQuery('users', getUsers);

  const isEmpty = useMemo(
    () => !isLoading && (!data || data?.length === 0),
    [isLoading, data],
  );

  return (
    <Flex p={10} alignItems="center">
      <Box
        borderWidth={1}
        borderRadius={8}
        width="100%"
        minH={400}
        borderColor="blackAlpha.100"
      >
        {isLoading ? (
          <Center minH={400}>
            <Spinner
              size="xl"
              emptyColor="gray.200"
              color="brand.primary"
              thickness="3px"
            />
          </Center>
        ) : (
          <Box>
            <Flex justifyContent="space-between" p={6} alignItems="center">
              <Heading as="h1" fontSize={18} color="brand.primary">
                Utilizadores
              </Heading>

              <Button
                variant="outline"
                size="md"
                color="brand.primary"
                leftIcon={<FiPlus />}
              >
                Adicionar
              </Button>
            </Flex>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr bg="#C4C4C4">
                    <Th>#</Th>
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>Tipo</Th>
                  </Tr>
                </Thead>

                {isEmpty ? (
                  <Th colSpan={4}>
                    <Center minH={350}>
                      <Text color="blackAlpha.500" textAlign="center">
                        Sem dados para mostrar!
                      </Text>
                    </Center>
                  </Th>
                ) : (
                  <Tbody>
                    <Tr>
                      <Td>1</Td>
                      <Td>Edson Paulo</Td>
                      <Td>edsonpaulo24@gmail.com</Td>
                      <Td>Administrador</Td>
                    </Tr>
                    <Tr>
                      <Td>2</Td>
                      <Td>Hélio Swing</Td>
                      <Td>centimetres (cm)</Td>
                      <Td>Cliente</Td>
                    </Tr>
                    <Tr>
                      <Td>3</Td>
                      <Td>Elias Samu-Samu</Td>
                      <Td>eliassamu@outlook.com</Td>
                      <Td>Funcionário</Td>
                    </Tr>
                    <Tr>
                      <Td>4</Td>
                      <Td>Jairo Loureiro</Td>
                      <Td>jairo2022@gmail.com</Td>
                      <Td>Cliente</Td>
                    </Tr>
                    <Tr>
                      <Td>5</Td>
                      <Td>Aminildo Zimbekwe</Td>
                      <Td>aminildo@hotmail.com</Td>
                      <Td>Funcionário</Td>
                    </Tr>
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot>
                      <Box />
                    </Tfoot>
                    <TableCaption pb={6}>
                      Tabela de utilizadores no sistema
                    </TableCaption>
                  </>
                )}
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Flex>
  );
};
