import axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache';

// Axios Interceptor Instance

const getInstance = () => {
  noStore();
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  })

}
const AxiosInstance = getInstance()

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);

export default AxiosInstance