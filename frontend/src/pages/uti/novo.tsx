
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UtiForm from "@/components/UtiForm";
import ApiError from "@/types/api-error";
import AxiosInstance from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function NewUtiPage() {
  const router = useRouter()

  const onSave = (name: string, desc: string, birth: Date,) => {
    AxiosInstance.post('/api/uti', { name: name, description: desc, birthday: new Date(birth.toUTCString().slice(0, -4)) }).then(r => {
      if (r.status == 200) {
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
    <UtiForm initBirth={undefined} initDesc="" initName="" onSave={onSave} onCancel={onCancel}></UtiForm>
  </DefaultLayout>)
}