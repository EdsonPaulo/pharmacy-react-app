import { UserTypeEnum } from './enums';

export interface IStatistics {
  countOrders: number;
  countProducts: number;
  totalOrdersValue: number;
}

export interface IAddress {
  pkAddress: number;
  name: string;
  residence: string;
  city: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPerson {
  pkPerson: number;
  name: string;
  email: string;
  bi?: string;
  phone?: string;
  birthDate?: string;
  address?: IAddress;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

export interface IUser {
  pkUser: number;
  email: string;
  accessToken: string;
  userType: UserTypeEnum;
  personalInfo: IPerson | null;
}

export interface IProductCategory {
  pkProductCategory: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  fkProductCategory: number;
  productCategory: IProductCategory;
}

export interface IProduct {
  pkProduct: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  manufactureDate: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  fkProductCategory: number;
  productCategory: IProductCategory;
}

export interface IProductOrder {
  fkOrder: number;
  fkProduct: number;
  pkProductOrder: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  pkOrder: number;
  total: number;
  address: IAddress;
  customer: IPerson;
  employee: IPerson;
  products: Array<
    IProduct & {
      productOrder: IProductOrder;
    }
  >;
  orderDate: string;
  observation: string;
  createdAt: string;
  updatedAt: string;
}
