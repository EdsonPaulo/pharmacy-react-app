import { toCamelCase } from '../helpers/objectTransform';
import { IOrder } from '../typescript/types';
import { APIConnector } from './APIConnector';

export const getOrders = async (): Promise<IOrder[]> => {
  const response = await APIConnector.get('/order');
  return toCamelCase(response?.data?.data) as IOrder[];
};

interface OrderPayload {
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

type TPostCreateOrder = (payload: OrderPayload) => Promise<IOrder>;

type TPutEditOrder = (payload: {
  orderId: number;
  order: OrderPayload;
}) => Promise<IOrder>;

export const postCreateOrder: TPostCreateOrder = async (payload) => {
  const response = await APIConnector.post('/order', payload);
  return toCamelCase(response.data?.data) as IOrder;
};

export const putEditOrder: TPutEditOrder = async ({ order, orderId }) => {
  const response = await APIConnector.put(`/order/${orderId}`, order);
  return toCamelCase(response.data?.data) as IOrder;
};

export const deleteOrder = async (orderId: number) => {
  const response = await APIConnector.delete(`/order/${orderId}`);
  return toCamelCase(response.data?.data) as IOrder;
};
