import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { UserTypesList } from './user-types-list';
import { UsersList } from './users-list';

export const UsersPage = () => {
  return (
    <Box flex={1} p={10}>
      <UsersList />

      {/**
      * <Tabs isFitted isLazy variant="enclosed-colored" colorScheme="teal">
        <TabList borderBottom="none">
          <Tab>Utilizadores</Tab>
          <Tab>Tipos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
          </TabPanel>

          <TabPanel>
            <UserTypesList />
          </TabPanel>
        </TabPanels>
      </Tabs> */}
    </Box>
  );
};
