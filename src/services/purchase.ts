import { toCamelCase } from '../helpers/objectTransform';
import { IPurchase } from '../typescript/types';
import { APIConnector } from './APIConnector';

export const getPurchases = async (): Promise<IPurchase[]> => {
  const response = await APIConnector.get('/purchase');
  return toCamelCase(response?.data?.data) as IPurchase[];
};

interface PurchasePayload {
  purchase_date: string | null;
  fk_supplier: number | null;
  fk_employee: number | null;
  fk_product: number | null;
  observation: string;
  quantity: number;
}

type TPostCreatePurchase = (payload: PurchasePayload) => Promise<IPurchase>;

type TPutEditPurchase = (payload: {
  purchaseId: number;
  purchase: PurchasePayload;
}) => Promise<IPurchase>;

export const postCreatePurchase: TPostCreatePurchase = async (payload) => {
  const response = await APIConnector.post('/purchase', payload);
  return toCamelCase(response.data?.data) as IPurchase;
};

export const putEditPurchase: TPutEditPurchase = async ({
  purchase,
  purchaseId,
}) => {
  const response = await APIConnector.put(`/purchase/${purchaseId}`, purchase);
  return toCamelCase(response.data?.data) as IPurchase;
};

export const deletePurchase = async (purchaseId: number) => {
  const response = await APIConnector.delete(`/purchase/${purchaseId}`);
  return toCamelCase(response.data?.data) as IPurchase;
};
