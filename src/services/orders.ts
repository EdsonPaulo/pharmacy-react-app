import { toCamelCase } from '../helpers/objectTransform';
import { IOrder } from '../typescript/types';
import { APIConnector } from './APIConnector';

export const getOrders = async (): Promise<IOrder[]> => {
  const response = await APIConnector.get('/order');
  return toCamelCase(response?.data?.data) as IOrder[];
};

interface OrderPayload {
  order_date: string | null;
  fk_customer: number | null;
  fk_address: number | null;
  fk_employee: number | null;
  observation: string;
  products: Array<{ id: number; quantity: number }>;
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
