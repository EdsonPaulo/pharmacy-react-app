import axios from 'axios';

export const APIConnector = axios.create({
  baseURL: 'http://localhost:2000',
});
