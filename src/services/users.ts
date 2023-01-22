import { UserTypeEnum } from '../typescript/enums';
import { toCamelCase } from '../helpers/objectTransform';
import { IUser } from '../typescript/types';
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

type TPutEditUser = (payload: {
  user: {
    name: string;
    email: string;
    password: string;
    user_type: UserTypeEnum | null;
  };
  userId: number;
}) => Promise<IUser>;

export const postCreateUser: TPostCreateUser = async (payload) => {
  const response = await APIConnector.post('/user', payload);
  return toCamelCase(response.data?.data) as IUser;
};

export const deleteUser = async (userId: number) => {
  const response = await APIConnector.delete(`/user/${userId}`);
  return toCamelCase(response.data?.data) as IUser;
};

export const putEditUser: TPutEditUser = async ({ user, userId }) => {
  const response = await APIConnector.put(`/user/${userId}`, user);
  return toCamelCase(response.data?.data) as IUser;
};
