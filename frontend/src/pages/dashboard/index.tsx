import useAuth from '../use-auth';
// import useApi from '@/utils/use-api';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import Patient from '@/types/patient';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Table from '@/components/Table';


export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<Patient[]>()

  const getData = () => {
    AxiosInstance.get<Patient[]>('/api/patients').then(resp => {
      setData(resp.data)
    }).catch(err => {
      const axiosError = err as AxiosError
      console.log(axiosError.message)
    })
  }

  useEffect(() => {
    console.log('Dashboard useffect')
    getData()
  }, [])

  if (user !== undefined) {
    return (
      <DefaultLayout>
        {data != undefined ? (<Table patients={data!} onAdded={getData}></Table>) :
          <p>Nenhum nome registrado</p>}

      </DefaultLayout>)
  }

  return <div>Not logged in</div>
}