import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

// Axios Interceptor Instance
const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken')
    if (token !== undefined) {
      config.headers.Authorization = `Bearer ${token.toString()}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => {
    // Can be modified response
    if (response.status == 401) {
      deleteCookie('accessToken')
    }
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);

export default AxiosInstance