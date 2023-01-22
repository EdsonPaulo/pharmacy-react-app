import { Box, Heading } from '@chakra-ui/react';
import { ProductCategoriesPage } from './product-categories';

export const PreferencesPage = () => {
  return (
    <Box flex={1} p={10} mt={6}>
      <Heading as="h1" fontSize={22} color="brand.primaryDark">
        Preferências
      </Heading>

      <Box mt={0} />

      <ProductCategoriesPage />

      {/**
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
      */}
    </Box>
  );
};
