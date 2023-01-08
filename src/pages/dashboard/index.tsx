import {
  Box,
  Text,
  Center,
  Heading,
  Divider,
  Button,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { OrdersPie } from './orders-pie';

const DashboardWidget = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <Box px={6} flex={1} key={label}>
    <Box>
      <Text fontSize="sm" color="brand.accent">
        {label}
      </Text>
      <Box mb={2} h="3px" w="25px" bgColor="#E96A10" />
      <Text color="#3C557A" fontWeight="bold" fontSize={{ md: 'lg', lg: 'xl' }}>
        {value}
      </Text>
    </Box>
  </Box>
);

export const DashboardPage = () => {
  const handleNewOrder = useCallback(() => {}, []);

  return (
    <Box flex={1} p={10}>
      <Heading as="h1" fontSize={18}>
        Dashboard
      </Heading>

      <Grid
        mt={4}
        mb={8}
        gap={4}
        rowGap={8}
        gridTemplateColumns={{ base: '100%', lg: '80% 20%' }}
      >
        <GridItem
          p={4}
          display="flex"
          borderRadius={5}
          borderWidth="1px"
          borderColor="rgba(0, 0, 0, 0.14)"
        >
          <DashboardWidget label="Valor em vendas" value={'AOA 1000005'} />

          <Divider orientation="vertical" mx={1} />

          <DashboardWidget label="Produtos Cadastrados" value={'00005033'} />

          <Divider orientation="vertical" mx={1} />

          <DashboardWidget label="Total de Encomendas" value={'00000055'} />
        </GridItem>

        <GridItem>
          <Button
            w="100%"
            h="100%"
            display="block"
            alignSelf={'center'}
            alignItems="center"
            colorScheme="teal"
            bg="brand.primary"
            onClick={handleNewOrder}
          >
            Realizar venda
            <Center mt={1}>
              <FiPlus size={25} />
            </Center>
          </Button>
        </GridItem>

        <GridItem>
          <Heading fontSize={16} color="brand.primary">
            Últimos Pedidos
          </Heading>
        </GridItem>

        <GridItem>
          <Text fontSize="sm" color="brand.primary" fontWeight="bold">
            Encomendas
          </Text>

          <Box h="100%" w="200px">
            <OrdersPie
              data={[
                {
                  id: 'cancelled',
                  label: 'Canceladas',
                  value: 15,
                  color: '#FF4070',
                },
                {
                  id: 'done',
                  label: 'Concluídas',
                  value: 10,
                  color: '#4EC478',
                },

                {
                  id: 'available',
                  label: 'Disponíveis',
                  value: 45,
                  color: '#5654F5',
                },
                {
                  id: 'progress',
                  label: 'Em andamento',
                  value: 30,
                  color: '#4CA8FF',
                },
              ]}
            />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};
