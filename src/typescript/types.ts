import { UserTypeEnum } from './enums';

export interface IAddress {
  pkAddress: number;
  name: string;
  residence: string;
  city: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGeneralUser {
  name: string;
  email: string;
  bi?: string;
  phone?: string;
  birthDate?: string;
  address?: IAddress;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  pkUser: number;
  email: string;
  accessToken: string;
  userType: UserTypeEnum;
  personalInfo: ICustomer | IEmployee | null;
}

export interface ICustomer extends IGeneralUser {
  pkCustomer: number;
}

export interface IEmployee extends IGeneralUser {
  pkEmployee: number;
}

export interface IProductCategory {
  pkProductCategory: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  pkProduct: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  manufactureDate: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  fkProductCategory: number;
  productCategory: IProductCategory;
}

export interface IOrder {
  pkOrder: number;
  total: number;
  customer: ICustomer;
  address: IAddress;
  employee: IEmployee;
  products: IProduct[];
  orderDate: string;
  observation: string;
  createdAt: string;
  updatedAt: string;
}
