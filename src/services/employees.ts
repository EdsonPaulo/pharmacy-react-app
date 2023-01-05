import { toCamelCase } from '../helpers/objectTransform';
import { IEmployee } from '../typescript/types';
import { APIConnector } from './APIConnector';

export const getEmployees = async (): Promise<IEmployee[]> => {
  const response = await APIConnector.get('/employee');
  return toCamelCase(response?.data?.data) as IEmployee[];
};

interface EmployeePayload {
  name: string;
  email: string;
  bi?: string;
  birth_date?: string;
  phone?: string;
  password: string;
  address: null | {
    name: string;
    city: string;
    residence: string;
  };
}

type TPostCreateEmployee = (payload: EmployeePayload) => Promise<IEmployee>;

type TPutEditEmployee = (payload: {
  employeeId: number;
  employee: EmployeePayload;
}) => Promise<IEmployee>;

export const postCreateEmployee: TPostCreateEmployee = async (payload) => {
  const response = await APIConnector.post('/employee', payload);
  return toCamelCase(response.data?.data) as IEmployee;
};

export const putEditEmployee: TPutEditEmployee = async ({
  employee,
  employeeId,
}) => {
  const response = await APIConnector.put(`/employee/${employeeId}`, employee);
  return toCamelCase(response.data?.data) as IEmployee;
};
