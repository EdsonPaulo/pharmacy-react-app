import { toCamelCase } from '../helpers/objectTransform';
import { ICustomer } from '../types/types';
import { APIConnector } from './APIConnector';

export const getCustomers = async (): Promise<ICustomer[]> => {
  const response = await APIConnector.get('/customer');
  return toCamelCase(response?.data?.data) as ICustomer[];
};

interface CustomerPayload {
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

type TPostCreateCustomer = (payload: CustomerPayload) => Promise<ICustomer>;

type TPutEditCustomer = (payload: {
  customerId: number;
  customer: CustomerPayload;
}) => Promise<ICustomer>;

export const postCreateCustomer: TPostCreateCustomer = async (payload) => {
  const response = await APIConnector.post('/customer', payload);
  return toCamelCase(response.data?.data) as ICustomer;
};

export const putEditCustomer: TPutEditCustomer = async ({
  customer,
  customerId,
}) => {
  const response = await APIConnector.put(`/customer/${customerId}`, customer);
  return toCamelCase(response.data?.data) as ICustomer;
};
