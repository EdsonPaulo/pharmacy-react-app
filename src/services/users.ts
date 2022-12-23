import { APIConnector } from './APIConnector';

export const getUsers = async () => {
  const response = await APIConnector.get('/user');
  return response.data?.data;
};

export const getUserTypes = async () => {
  const response = await APIConnector.get('/user-type');
  return response.data?.data;
};
