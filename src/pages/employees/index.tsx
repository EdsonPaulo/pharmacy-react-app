import { Box, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getEmployees } from '../../services/employees';
import { IEmployee } from '../../typescript/types';
import { EmployeesForm } from './employees-form';
import { EmployeesList } from './employees-list';

export const EmployeesPage = () => {
  const { data, isLoading, refetch } = useQuery('employees', getEmployees);
  const { isOpen: isFormOpen, onOpen: openForm, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee>();
  const [formMode, setFormMode] = useState<'edit' | 'view'>('view');

  const handleAddEmployee = useCallback(() => {
    setFormMode('edit');
    setSelectedEmployee(undefined);
    openForm();
  }, [openForm]);

  const handleViewEmployee = useCallback(
    (customer: IEmployee) => {
      setSelectedEmployee(customer);
      setFormMode('view');
      openForm();
    },
    [openForm],
  );

  const handleEditEmployee = useCallback(
    (customer: IEmployee) => {
      setFormMode('edit');
      setSelectedEmployee(customer);
      openForm();
    },
    [openForm],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    setSelectedEmployee(undefined);
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
      <EmployeesList
        employees={data}
        isEmpty={isEmpty}
        isLoading={isLoading}
        onAddNew={handleAddEmployee}
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        size={{ base: 'sm', md: 'lg', lg: '4xl' }}
      >
        <ModalOverlay />

        <EmployeesForm
          mode={formMode}
          selectedEmployee={selectedEmployee}
          onClose={handleCloseModal}
          onRefetch={handleRefetch}
        />
      </Modal>
    </Box>
  );
};
