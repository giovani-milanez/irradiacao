import { useAuth } from '../../utils/use-auth';
// import useApi from '@/utils/use-api';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import UtiPatient from '@/types/UtiPatient';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Panel from '@/components/Panel';
import UtiTable from '@/components/UtiTable';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import QueueInfo from '@/types/QueueInfo';
import QueueInfoComponent from '@/components/QueueInfo';
// import { CardExample } from '@/components/Card';


export default function UtiPage() {
  const { user } = useAuth()
  const [data, setData] = useState<UtiPatient[]>()
  const [qInfo, setQinfo] = useState<QueueInfo>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getData = () => {
    setLoading(true)
    AxiosInstance.get<UtiPatient[]>('/api/uti').then(resp => {
      setData(resp.data)
    }).catch(err => {
      const axiosError = err as AxiosError
      console.log(axiosError.message)
    }).finally(() => { setLoading(false) })

    AxiosInstance.get<QueueInfo>('/api/uti/queue-info').then(resp => {
      setQinfo(resp.data)
    })
  }

  const deleteClick = (id: number) => {
    AxiosInstance.delete(`/api/uti/${id}`).then(r => {
      if (r.status == 204) {
        toast.success('Nome removido!')
        getData()
      } else {
        toast.error('Ocorreu um erro, tente novamente')
      }
    }).catch(() => toast.error('Ocorreu um erro, tente novamente'))
  }

  const rowClick = (id: number) => {
    router.push(`/uti/editar/${id}`)
  }

  const leaveQ = (id: number) => {
    AxiosInstance.post(`/api/uti/${id}/queue/leave`).then(r => {
      if (r.status == 204) {
        toast.success('O nome foi removido da fila!')
        getData()
      } else {
        toast.error('Ocorreu um erro, tente novamente')
      }
    }).catch(() => toast.error('Ocorreu um erro, tente novamente'))
  }

  const joinQ = (id: number) => {
    AxiosInstance.post(`/api/uti/${id}/queue/join`).then(r => {
      if (r.status == 204) {
        toast.success('O nome foi colocado na fila!')
        getData()
      } else {
        toast.error('Ocorreu um erro, tente novamente')
      }
    }).catch(() => toast.error('Ocorreu um erro, tente novamente'))
  }

  useEffect(() => {
    console.log('Dashboard useffect')
    getData()
  }, [])

  if (user !== undefined) {
    return (
      <DefaultLayout>
        {data != undefined ? (<>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            <div className={qInfo ? 'lg:col-span-3' : 'col-span-1 lg:col-span-4'}>
              <Panel title='Irradiação Intensiva'>
                {/* <p className='font-light text-base sm:text-lg md:text-xl'>As irradiações ocorrem toda semana e são feitas pelos membros do Grupo de Irradiação da Comunidade da Ação.</p> */}
                <p className='font-light text-base sm:text-lg md:text-xl'>Somente adicione caso a pessoa tenha <b>doença grave</b>.</p>
                <p className='pt-2 font-light text-base sm:text-lg md:text-xl'>Nesta modalidade são atendidas cerca de 15 pessoas por irradiação.</p>
              </Panel>
            </div>
            {qInfo && <QueueInfoComponent info={qInfo}></QueueInfoComponent>}

          </div>
          <div className='pt-10'>
            <UtiTable patients={data} loading={loading} onDeleteClick={deleteClick} onRowClick={rowClick} onEnterClick={joinQ} onLeaveClick={leaveQ} onNewClick={() => { router.push('/uti/novo') }}></UtiTable>
          </div>
        </>) :
          <p>Nenhum nome registrado</p>}

      </DefaultLayout>)
  }

  return <div>Not logged in</div>
}