import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ProductsList } from './products-list';
import { ProductCategoriesList } from './product-categories-list';

export const ProductsPage = () => {
  return (
    <Box flex={1} p={10}>
      <Box />

      <Tabs isFitted isLazy variant="enclosed-colored" colorScheme="teal">
        <TabList borderBottom="none">
          <Tab>Produtos</Tab>
          <Tab>Categorias</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProductsList />
          </TabPanel>

          <TabPanel>
            <ProductCategoriesList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
