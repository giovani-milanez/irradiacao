import useAuth from '../use-auth';
// import useApi from '@/utils/use-api';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import Patient from '@/types/patient';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import PatientTable from '@/components/PatientTable';
import Panel from '@/components/Panel';
// import { CardExample } from '@/components/Card';


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
        {data != undefined ? (<>
          <Panel title='Irradiação Geral'>
            <p className='font-light text-xl'>As irradiações ocorrem toda semana e são feitas pelos membros do Grupo de Irradiação da Comunidade da Ação.</p>
            <p className='pt-1 font-light text-xl'>Todos os nomes aqui colocados irão receber a irradiação já na próxima sessão.</p>
            <p className='pt-1 font-light text-xl'>Os nomes tem validade de 30 dias ou cerca de 4 irradições, após esse período será necessário renovar a validade para continuar recebendo.</p>
          </Panel>
          <div className='pt-10'>
            <PatientTable patients={data} onAdded={getData}></PatientTable>
          </div>
        </>) :
          <p>Nenhum nome registrado</p>}

      </DefaultLayout>)
  }

  return <div>Not logged in</div>
}