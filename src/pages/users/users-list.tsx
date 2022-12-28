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

const UserTypesMap: Record<string, string> = {
  customer: 'Cliente',
  admin: 'Administrador',
  employee: 'Funcionário',
};

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
                    {data?.map((u: any) => (
                      <Tr key={u.pk_user}>
                        <Td>{u.pk_user}</Td>
                        <Td>{(u?.customer || u?.employee)?.name}</Td>
                        <Td>{u.email}</Td>
                        <Td>{UserTypesMap[u.user_type]}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}

                {!isEmpty && (
                  <>
                    <Tfoot>
                      <Box />
                    </Tfoot>
                    {data.length > 5 && (
                      <TableCaption mt={4} pb={6}>
                        Tabela de utilizadores no sistema
                      </TableCaption>
                    )}
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
