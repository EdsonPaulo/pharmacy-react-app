import { toCamelCase } from '../helpers/objectTransform';
import { IProduct, IProductCategory } from '../typescript/types';
import { APIConnector } from './APIConnector';

/** Products **/

export const getProducts = async (): Promise<IProduct[]> => {
  const response = await APIConnector.get('/product');
  return toCamelCase(response.data?.data) as IProduct[];
};

type TPostCreateProduct = (payload: {
  name: string;
  price: string;
  description?: string;
  manufacture_date: string;
  expiration_date: string;
  product_category: number;
}) => Promise<IProduct>;

export const postCreateProduct: TPostCreateProduct = async (payload) => {
  const response = await APIConnector.post('/product', payload);
  return toCamelCase(response.data?.data) as IProduct;
};

/** Product Categories **/

export const getProductCategories = async (): Promise<IProductCategory[]> => {
  const response = await APIConnector.get('/product-category');
  return toCamelCase(response.data?.data) as IProductCategory[];
};

type TPostCreateProductCategory = (payload: {
  name: string;
}) => Promise<IProductCategory>;

export const postCreateProductCategory: TPostCreateProductCategory = async (
  payload,
) => {
  const response = await APIConnector.post('/product-category', payload);
  return toCamelCase(response.data?.data) as IProductCategory;
};
