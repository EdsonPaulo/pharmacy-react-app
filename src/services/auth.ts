import { UserTypeEnum } from '../types/enums';
import { toCamelCase } from '../helpers/objectTransform';
import { IUser } from '../types/types';
import { APIConnector } from './APIConnector';

export const postSignIn = async (payload: {
  email: string;
  password: string;
}): Promise<IUser> => {
  const response = await APIConnector.post('/user/authenticate', {
    email: payload.email,
    password: payload.password,
  });
  return toCamelCase(response.data?.data) as IUser;
};

export const postSignUp = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const response = await APIConnector.post('/user/register', {
    user_type: UserTypeEnum.CUSTOMER,
    name: payload.name,
    email: payload.email,
    password: payload.password,
  });
  return toCamelCase(response.data?.data) as IUser;
};

export const getMeUser = async (): Promise<IUser> => {
  const response = await APIConnector.get('/user/me');
  return toCamelCase(response.data?.data) as IUser;
};
