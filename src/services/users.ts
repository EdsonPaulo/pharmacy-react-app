import { UserTypeEnum } from '../types/enums';
import { toCamelCase } from '../helpers/objectTransform';
import { IUser } from '../types/types';
import { APIConnector } from './APIConnector';

export const getUsers = async (): Promise<IUser[]> => {
  const response = await APIConnector.get('/user');
  return toCamelCase(response.data?.data) as IUser[];
};

type TPostCreateUser = (payload: {
  name: string;
  email: string;
  password: string;
  user_type: UserTypeEnum | null;
}) => Promise<IUser>;

export const postCreateUser: TPostCreateUser = async (payload) => {
  const response = await APIConnector.post('/user', payload);
  return toCamelCase(response.data?.data) as IUser;
};
