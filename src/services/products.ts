import { toCamelCase } from '../helpers/objectTransform';
import { IProduct, IProductCategory } from '../typescript/types';
import { APIConnector } from './APIConnector';

/** Products **/

type TPostUploadImage = (payload: { file: File; dataUrl: string }) => Promise<{
  url: string;
  name: string;
}>;

export const postUploadImage: TPostUploadImage = async ({ file, dataUrl }) => {
  const formData = new FormData();
  formData.append('file', file);
  // formData.append('dataUrl', dataUrl);

  const response = await APIConnector.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
  return toCamelCase(response.data?.data) as any;
};

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

export const deleteProduct = async (productId: number) => {
  const response = await APIConnector.delete(`/product/${productId}`);
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

export const deleteProductCategory = async (productCategoryId: number) => {
  const response = await APIConnector.delete(
    `/product-category/${productCategoryId}`,
  );
  return toCamelCase(response.data?.data) as IProductCategory;
};
