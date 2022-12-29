import { UserTypeEnum } from '../constants/enums';
import { APIConnector } from './APIConnector';

export const postSignIn = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await APIConnector.post('/user/authenticate', {
    email: payload.email,
    password: payload.password,
  });
  return response?.data?.data;
};

export const postSignUp = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await APIConnector.post('/user/register', {
    user_type: UserTypeEnum.CUSTOMER,
    name: payload.name,
    email: payload.email,
    password: payload.password,
  });
  return response?.data?.data;
};

export const getMeUser = async () => {
  const response = await APIConnector.get('/user/me');
  return response?.data?.data;
};
