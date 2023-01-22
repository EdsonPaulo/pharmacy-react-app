import {
  Box,
  Text,
  Center,
  Heading,
  Divider,
  Button,
  Grid,
  GridItem,
  SimpleGrid,
  Modal,
  ModalOverlay,
  useDisclosure,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatMoney } from '../../helpers/numberFormat';
import { getOrders } from '../../services/orders';
import { getStatistics } from '../../services/statistics';
import { OrderItem } from '../orders/order-item';
import { OrdersForm } from '../orders/orders-form';
import { OrdersPie } from './orders-pie';

const DashboardWidget = ({
  label,
  value,
  isLoading,
}: {
  isLoading?: boolean;
  label: string;
  value: string;
}) => (
  <Box px={6} flex={1} key={label}>
    <Flex justifyContent="space-between">
      <Box>
        <Text fontSize="sm" color="brand.accent">
          {label}
        </Text>
        <Box mb={2} h="3px" w="25px" bgColor="#E96A10" />
      </Box>

      {isLoading && <Spinner size="xs" color="brand.accent" />}
    </Flex>

    <Text color="#3C557A" fontWeight="bold" fontSize={{ md: 'lg', lg: 'xl' }}>
      {value}
    </Text>
  </Box>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    refetch,
  } = useQuery('orders', getOrders);
  const { data: statsData, isLoading: isLoadingStats } = useQuery(
    'dashboard-stats',
    getStatistics,
  );

  const orders = useMemo(() => ordersData?.slice?.(0, 5) ?? [], [ordersData]);

  const isEmpty = useMemo(
    () => !isLoadingOrders && (!ordersData || ordersData?.length === 0),
    [isLoadingOrders, ordersData],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Box flex={1} p={10} mt={6}>
      <Heading as="h1" fontSize={22} color="brand.primaryDark">
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
          <DashboardWidget
            isLoading={isLoadingStats}
            label="Valor em vendas"
            value={formatMoney(statsData?.totalOrdersValue ?? 0)}
          />

          <Divider orientation="vertical" mx={1} />

          <DashboardWidget
            isLoading={isLoadingStats}
            label="Produtos Cadastrados"
            value={`00000${statsData?.countProducts ?? 0}`}
          />

          <Divider orientation="vertical" mx={1} />

          <DashboardWidget
            isLoading={isLoadingStats}
            label="Total de Encomendas"
            value={`00000${statsData?.countOrders ?? 0}`}
          />
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
            onClick={openForm}
          >
            Realizar venda
            <Center mt={1}>
              <FiPlus size={25} />
            </Center>
          </Button>
        </GridItem>

        <GridItem>
          <Flex mb={2} alignItems="center" justifyContent="space-between">
            <Heading fontSize={16} color="brand.primaryDark">
              Últimos Pedidos
            </Heading>

            <Button
              variant="ghost"
              colorScheme="green"
              fontSize="xs"
              rightIcon={<HiOutlineArrowRight />}
              onClick={() => {
                navigate(ROUTES.Orders);
              }}
            >
              Ver tudo
            </Button>
          </Flex>

          {isEmpty ? (
            <Center minH={350}>
              <Text color="blackAlpha.500" textAlign="center">
                Sem dados para mostrar!
              </Text>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px">
              {orders?.map((o) => (
                <OrderItem hideActions order={o} key={o.pkOrder} />
              ))}
            </SimpleGrid>
          )}
        </GridItem>

        <GridItem>
          <Text fontSize="sm" color="brand.primaryDark" fontWeight="bold">
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

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '2xl' }}
      >
        <ModalOverlay />
        <OrdersForm
          mode="edit"
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
