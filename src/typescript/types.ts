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
  personalInfo: ICustomer | IEmpoyee | null;
}

export interface ICustomer extends IGeneralUser {
  pkCustomer: number;
}

export interface IEmpoyee extends IGeneralUser {
  pkEmployee: number;
}
