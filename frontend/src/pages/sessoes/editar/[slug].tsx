
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import SessionForm from "@/components/SessionForm";
import ApiError from "@/types/api-error";
import Patient from "@/types/patient";
import Session from "@/types/Session";
import UtiPatient from "@/types/UtiPatient";
import AxiosInstance from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditSessionsPage() {
  const router = useRouter()
  const [data, setData] = useState<Session>()
  const [patients, setPatients] = useState<Patient[]>()
  const [selectedPatients, setSelectedPatients] = useState<Set<string | number>>(new Set());
  const [utis, setUtis] = useState<UtiPatient[]>()
  const [selectedUtis, setSelectedUtis] = useState<Set<string | number>>(new Set());
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (router.query.slug == undefined) {
      return
    }
    const id = (router.query.slug as string)
    AxiosInstance.get<Session>(`/api/session/${id}`).then(resp => {
      if (resp.status == 200) {
        setData(resp.data);

        AxiosInstance.get<Patient[]>(`/api/patients/valids`).then(r => {
          if (r.status == 200) {
            setPatients(r.data)
            const selected = new Set<string | number>()
            r.data.forEach(p => { if (resp.data.patients.some(pd => pd.id == p.id)) { selected.add(p.id) } })
            setSelectedPatients(selected)

            AxiosInstance.get<UtiPatient[]>(`/api/uti/queue`).then(r2 => {
              if (r2.status == 200) {
                setUtis(r2.data)

                const selectedUtis = new Set<string | number>()
                r2.data.forEach(p => { if (resp.data.utis.some(pd => pd.id == p.id)) { selectedUtis.add(p.id) } })
                setSelectedUtis(selectedUtis)
              }
            })
          }
        })
      }
    }).finally(() => { setLoading(false) })
  }, [router])

  const onSave = (title: string, place: string, desc: string, data: Date, patients: Set<string | number>, utis: Set<string | number>) => {
    const id = (router.query.slug as string)
    AxiosInstance.put(`/api/session/${id}`, { title: title, desc: desc, place: place, date: new Date(data.toUTCString()), patient_ids: Array.from(patients), uti_ids: Array.from(utis) }).then(r => {
      if (r.status == 204) {
        toast.success('Sessao atualizada!')
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
        <SessionForm
          patients={patients ? patients : []}
          selectedPatients={selectedPatients}
          onSelectedRowsChange={setSelectedPatients}
          utis={utis ? utis : []}
          selectedUtis={selectedUtis}
          onSelectedUtiChange={setSelectedUtis}
          initData={new Date(data.date)}
          initDesc={data.desc} initTitle={data.title} initPlace={data.place}
          onSave={onSave} onCancel={onCancel}>
        </SessionForm>
        : <p>Nao foi possivel carregar</p>}

  </DefaultLayout>)
}