import { APIConnector } from './APIConnector';

export const postSignIn = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await APIConnector.post('/sign-in', {
    email: payload.email,
    password: payload.password,
  });
  return response.data;
};

export const postSignUp = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await APIConnector.post('/sign-up', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
  });
  return response.data;
};
