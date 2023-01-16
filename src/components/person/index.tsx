import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getPersons } from '../../services/person';
import { UserTypeEnum } from '../../typescript/enums';
import { IPerson } from '../../typescript/types';
import { PersonForm } from './person-form';
import { PersonList } from './person-list';

interface PersonPageProps {
  personType: UserTypeEnum;
}

export const PersonPage = ({ personType }: PersonPageProps) => {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const { data, isLoading, refetch } = useQuery(`persons-${personType}`, () =>
    getPersons(personType),
  );
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedPerson, setSelectedPerson] = useState<IPerson>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddPerson = useCallback(() => {
    setFormMode('edit');
    setSelectedPerson(undefined);
    openForm();
  }, [openForm]);

  const handleViewPerson = useCallback(
    (person: IPerson) => {
      setSelectedPerson(person);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditPerson = useCallback(
    (person: IPerson) => {
      setFormMode('edit');
      setSelectedPerson(person);
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedPerson(undefined);
  }, [onClose]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const isEmpty = useMemo(
    () => !isLoading && (!data || data?.length === 0),
    [isLoading, data],
  );

  return (
    <Box flex={1} p={10}>
      <PersonList
        personType={personType}
        persons={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddPerson}
        onView={handleViewPerson}
        onEdit={handleEditPerson}
        onRefetch={handleRefetch}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '4xl' }}
      >
        <ModalOverlay />

        <PersonForm
          mode={formMode}
          selectedPerson={selectedPerson}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
          personType={personType}
        />
      </Modal>
    </Box>
  );
};
