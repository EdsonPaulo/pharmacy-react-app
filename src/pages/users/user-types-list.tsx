import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Text,
  Center,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getUserTypes } from '../../services/users';
import { FiPlus } from 'react-icons/fi';
import { useMemo } from 'react';

export const UserTypesList = () => {
  const { data, isLoading } = useQuery('user-type', getUserTypes);

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
        minH={300}
        borderColor="blackAlpha.100"
      >
        {isLoading ? (
          <Center minH={300}>
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
                Tipos de utilizadores
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
                    <Th>Designação</Th>
                  </Tr>
                </Thead>

                {isEmpty ? (
                  <Th colSpan={2}>
                    <Center minH={250}>
                      <Text color="blackAlpha.500" textAlign="center">
                        Sem dados para mostrar!
                      </Text>
                    </Center>
                  </Th>
                ) : (
                  <Tbody>
                    <Tr>
                      <Td>1</Td>
                      <Td>Administrador</Td>
                    </Tr>
                    <Tr>
                      <Td>2</Td>
                      <Td>Funcionário</Td>
                    </Tr>
                    <Tr>
                      <Td>3</Td>
                      <Td>Cliente</Td>
                    </Tr>
                  </Tbody>
                )}

                {!isEmpty && (
                  <TableCaption pb={6}>
                    Tabela de tipos de utilizadores (função/premissão)
                  </TableCaption>
                )}
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Flex>
  );
};
