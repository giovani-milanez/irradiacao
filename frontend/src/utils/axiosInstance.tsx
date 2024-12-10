import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { unstable_noStore as noStore } from 'next/cache';

// Axios Interceptor Instance

const getInstance = () => {
  noStore();
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
  })

}
const AxiosInstance = getInstance()

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