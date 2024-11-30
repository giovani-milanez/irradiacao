import { useState, useEffect } from 'react';
import AxiosInstance from './axiosInstance';
import { AxiosError } from 'axios';
const useApi = (url: string, options = {}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // AxiosInstance.get(url, options).then(resp => {}).catch(err => {})
        const response = await AxiosInstance.get(url, options);
        setData(response.data);
      } catch (err) {
        const axiosError = err as AxiosError
        setError(axiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, options]);
  return { data, loading, error };
};
export default useApi;