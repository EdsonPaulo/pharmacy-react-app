import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ProductCategoriesPage } from './product-categories';

export const PreferencesPage = () => {
  return (
    <Box flex={1} p={10}>
      <Heading>Preferências</Heading>
      <Box />

      <Tabs isFitted isLazy variant="enclosed-colored" colorScheme="teal">
        <TabList borderBottom="none">
          <Tab>Categorias (produto)</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProductCategoriesPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
