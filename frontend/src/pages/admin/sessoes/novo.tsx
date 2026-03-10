
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import SessionForm from "@/components/SessionForm";
import ApiError from "@/types/api-error";
import Patient from "@/types/patient";
import UtiPatient from "@/types/UtiPatient";
import AxiosInstance from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NewSessionPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>()
  const [selectedPatients, setSelectedPatients] = useState<Set<string | number>>(new Set());
  const [utis, setUtis] = useState<UtiPatient[]>()
  const [selectedUtis, setSelectedUtis] = useState<Set<string | number>>(new Set());
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    AxiosInstance.get<UtiPatient[]>(`/api/uti/queue`).then(r2 => {
      if (r2.status == 200) {
        setUtis(r2.data)

        const selectedUtis = new Set<string | number>()
        r2.data.forEach(p => { selectedUtis.add(p.id) })
        setSelectedUtis(selectedUtis)
      }
    }).finally(() => { setLoading(false) })
  }, [])

  const onSave = (title: string, place: string, desc: string, placeImg: string | undefined, data: Date, utis: Set<string | number>) => {
    AxiosInstance.post('/api/session', { title: title, desc: desc, place: place, place_img: placeImg, date: new Date(data.toUTCString()), uti_ids: Array.from(utis) }).then(r => {
      if (r.status == 200) {
        toast.success('Sessao adicionado!')
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
    <div>
      {loading ? <LoadingSpinner></LoadingSpinner> : <></>}
      <SessionForm
        utis={utis ? utis : []}
        selectedUtis={selectedUtis}
        onSelectedUtiChange={setSelectedUtis}
        initData={undefined}
        initDesc="" initTitle="" initPlace="" initPlaceImg={undefined}
        onSave={onSave} onCancel={onCancel}>
      </SessionForm>
    </div>
  </DefaultLayout>)
}