import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import SessionsTable from "@/components/SessionsTable";
import Session from "@/types/Session";
import AxiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function SessoesPage() {
  const [data, setData] = useState<Session[]>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getData = () => {
    setLoading(true)
    AxiosInstance.get<Session[]>('/api/session').then(resp => {
      setData(resp.data)
    }).catch(err => {
      const axiosError = err as AxiosError
      console.log(axiosError.message)
    }).finally(() => { setLoading(false) })
  }

  const newClick = () => {
    router.push('/sessoes/novo')
  }
  const deleteClick = (id: number) => {
    AxiosInstance.delete(`/api/session/${id}`).then(r => {
      if (r.status == 204) {
        toast.success('Sessao removido!')
        getData()
      } else {
        toast.error('Ocorreu um erro, tente novamente')
      }
    }).catch(() => toast.error('Ocorreu um erro, tente novamente'))
  }

  const rowClick = (id: number) => {
    router.push(`/sessoes/editar/${id}`)
  }

  useEffect(() => {
    console.log('Session useffect')
    getData()
  }, [])

  return (<DefaultLayout>{data != undefined ? (<SessionsTable sessions={data} loading={loading} onDeleteClick={deleteClick} onRowClick={rowClick} onLeaveClick={(id: number) => { console.log(id) }} onNewClick={newClick}></SessionsTable>) : (<LoadingSpinner></LoadingSpinner>)}</DefaultLayout>)
}