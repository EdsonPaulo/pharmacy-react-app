import axios from 'axios';
import NProgress from 'nprogress';

export const APIConnector = axios.create({
  baseURL: 'https://pharmacy-web-server.onrender.com',
  // 'http://localhost:2000',
});

APIConnector.interceptors.request.use(
  (req) => {
    NProgress.start();
    const accessToken = localStorage.getItem('access_token');
    if (accessToken)
      return {
        ...req,
        headers: {
          ...req.headers,
          'x-access-token': accessToken,
        },
      };
    return req;
  },
  async (err) => {
    return await Promise.reject(err);
  },
);

APIConnector.interceptors.response.use(
  (res) => {
    NProgress.done();
    return res;
  },
  async (err) => {
    NProgress.done();
    return await Promise.reject(err);
  },
);
