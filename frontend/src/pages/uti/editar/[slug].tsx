
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import UtiForm from "@/components/UtiForm";
import ApiError from "@/types/api-error";
import UtiPatient from "@/types/UtiPatient";
import AxiosInstance from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditUtiPage() {
  const router = useRouter()
  const [data, setData] = useState<UtiPatient>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (router.query.slug == undefined) {
      return
    }
    const id = (router.query.slug as string)

    console.log('id is ', id)
    AxiosInstance.get<UtiPatient>(`/api/uti/${id}`).then(r => {
      if (r.status == 200) {
        setData(r.data)
      }
    }).finally(() => { setLoading(false) })
  }, [router])

  const onSave = (name: string, desc: string, birth: Date,) => {
    const id = (router.query.slug as string)
    AxiosInstance.put(`/api/uti/${id}`, { name: name, description: desc, birthday: birth }).then(r => {
      if (r.status == 204) {
        toast.success('Nome adicionado!')
        router.back()
      } else {
        toast.error('Ocorreu um erro, tente novamente')
      }
    })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ApiError>
          if (axiosError.response?.data.message == 'already exists') {
            toast.error('Nome já registrado!')
          } else {
            toast.error('Ocorreu um erro, tente novamente')
          }
        } else {
          toast.error('Ocorreu um erro, tente novamente')
        }
      })
      .finally(() => { })
  }
  const onCancel = () => {
    router.back()
  }

  return (<DefaultLayout>
    {loading ? <LoadingSpinner></LoadingSpinner> :
      data != undefined ?
        <UtiForm initBirth={new Date(data.birthday.slice(0, -1))} initDesc={data.description || ""} initName={data.name} onSave={onSave} onCancel={onCancel}></UtiForm>
        : <p>Nao foi possivel carregar</p>}

  </DefaultLayout>)
}