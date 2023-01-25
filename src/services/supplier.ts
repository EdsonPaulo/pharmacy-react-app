import { toCamelCase } from '../helpers/objectTransform';
import { ISupplier } from '../typescript/types';
import { APIConnector } from './APIConnector';

export const getSuppliers = async (): Promise<ISupplier[]> => {
  const response = await APIConnector.get('/supplier');
  return toCamelCase(response?.data?.data) as ISupplier[];
};

interface SupplierPayload {
  name: string;
  email: string;
  nif?: string;
  phone?: string;
  address: null | {
    name: string;
    city: string;
    residence: string;
  };
}

type TPostCreateSupplier = (payload: SupplierPayload) => Promise<ISupplier>;

type TPutEditSupplier = (payload: {
  supplierId: number;
  supplier: SupplierPayload;
}) => Promise<ISupplier>;

export const postCreateSupplier: TPostCreateSupplier = async (payload) => {
  const response = await APIConnector.post('/supplier', payload);
  return toCamelCase(response.data?.data) as ISupplier;
};

export const putEditSupplier: TPutEditSupplier = async ({
  supplier,
  supplierId,
}) => {
  const response = await APIConnector.put(`/supplier/${supplierId}`, supplier);
  return toCamelCase(response.data?.data) as ISupplier;
};

export const deleteSupplier = async (supplierId: number) => {
  const response = await APIConnector.delete(`/supplier/${supplierId}`);
  return toCamelCase(response.data?.data) as ISupplier;
};
