
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import Tabs, { TabItem } from "@/components/Tabs";
import Member from "@/types/member";
import Session from "@/types/Session";
import AxiosInstance from "@/utils/axiosInstance";
import { MaximizeIcon, MinimizeIcon } from "@/utils/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function ViewSessionsPage() {
  const router = useRouter()
  const [data, setData] = useState<Session>()
  const [members, setMembers] = useState<Member[]>()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const [fontSize, setFontSize] = useState("lg")

  const fisnishSession = () => {
    AxiosInstance.post(`/api/session/${data?.id}/finish`).then(r => {
      if (r.status == 204) {
        toast.success('Sessão finalizada com sucesso!')
        router.back()
      } else {
        toast.error('Ocorreu um erro, tente novamente')
      }
    }).catch(() => toast.error('Ocorreu um erro, tente novamente')).finally(() => { setShowModal(false) })
  }


  const GeralComponent = () => {
    return (<div className="mb-6">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Lista nomes Irradiacao Geral ({data?.patients_count})</h2>
        <svg className="fill-current" fill="#000000" width="18px" height="18px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>hand-holding-hand</title> <path d="M29.064 19.701c-0.421-0.177-0.91-0.28-1.423-0.28-0.577 0-1.123 0.13-1.611 0.362l0.023-0.010-5.778 2.595c0.003-0.047 0.026-0.087 0.026-0.134-0.015-1.371-1.129-2.476-2.502-2.476-0.069 0-0.137 0.003-0.204 0.008l0.009-0.001h-3.783l-4.76-1.395c-0.062-0.020-0.133-0.031-0.207-0.031-0.001 0-0.003 0-0.004 0h-2.169v-0.757c-0-0.414-0.336-0.75-0.75-0.75h-3.883c-0.414 0-0.75 0.336-0.75 0.75v0 12.208c0 0.414 0.336 0.75 0.75 0.75h3.883c0.414-0 0.75-0.336 0.75-0.75v0-1.005c1.818 0.284 3.445 0.742 4.987 1.367l-0.149-0.054c1.15 0.416 2.478 0.656 3.862 0.656 0.007 0 0.014 0 0.021-0h-0.001c0.005 0 0.011 0 0.017 0 1.604 0 3.133-0.319 4.528-0.898l-0.078 0.029c1.243-0.553 2.298-1.136 3.297-1.799l-0.082 0.051c0.338-0.209 0.674-0.418 1.014-0.619 1.633-0.967 2.945-1.816 4.129-2.672 0.579-0.412 1.083-0.819 1.563-1.253l-0.014 0.013c0.373-0.302 0.671-0.682 0.871-1.116l0.008-0.019c0.031-0.079 0.048-0.17 0.048-0.266 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005c-0.146-1.017-0.755-1.866-1.603-2.337l-0.016-0.008zM5.181 29.041h-2.383v-10.709h2.383zM28.719 22.541c-0.412 0.37-0.86 0.729-1.328 1.062l-0.047 0.032c-1.143 0.826-2.418 1.65-4.014 2.596-0.348 0.205-0.691 0.418-1.037 0.631-0.854 0.573-1.837 1.12-2.864 1.586l-0.13 0.053c-1.152 0.474-2.49 0.748-3.892 0.748-1.203 0-2.359-0.203-3.436-0.575l0.074 0.022c-1.555-0.648-3.363-1.145-5.248-1.407l-0.117-0.013v-7.436h2.062l4.76 1.395c0.062 0.020 0.133 0.031 0.207 0.031 0.001 0 0.003 0 0.004 0h3.89c0.883 0 1.197 0.521 1.197 0.969s-0.314 0.969-1.197 0.969h-6.809c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h7.781c0.001 0 0.003 0 0.004 0 0.11 0 0.214-0.024 0.307-0.068l-0.004 0.002 7.795-3.5c0.288-0.132 0.625-0.209 0.98-0.209 0.265 0 0.52 0.043 0.758 0.122l-0.017-0.005c0.383 0.23 0.658 0.604 0.752 1.046l0.002 0.011c-0.136 0.159-0.278 0.302-0.429 0.435l-0.005 0.004zM29.951 1.506h-3.883c-0.414 0-0.75 0.336-0.75 0.75v0 1.011c-1.814-0.279-3.443-0.74-4.981-1.374l0.143 0.052c-1.159-0.415-2.496-0.654-3.89-0.654-1.606 0-3.138 0.319-4.536 0.896l0.079-0.029c-1.242 0.552-2.297 1.136-3.295 1.8l0.081-0.051c-0.337 0.208-0.674 0.417-1.014 0.618-1.646 0.975-2.958 1.823-4.127 2.671-0.576 0.408-1.078 0.812-1.555 1.244l0.014-0.012c-0.377 0.304-0.678 0.686-0.882 1.123l-0.008 0.019c-0.032 0.081-0.051 0.175-0.051 0.273 0 0.056 0.006 0.11 0.017 0.162l-0.001-0.005c0.147 1.016 0.756 1.864 1.604 2.336l0.016 0.008c0.377 0.186 0.82 0.295 1.289 0.295 0.013 0 0.026-0 0.039-0l-0.002 0c0.612-0.008 1.191-0.142 1.715-0.377l-0.027 0.011 5.778-2.597c-0.003 0.047-0.026 0.088-0.026 0.135 0.014 1.371 1.129 2.477 2.502 2.477 0.069 0 0.136-0.003 0.204-0.008l-0.009 0.001h3.783l4.76 1.395c0.062 0.019 0.134 0.030 0.208 0.030 0.001 0 0.002 0 0.003 0h2.168v0.757c0 0.414 0.336 0.75 0.75 0.75h3.883c0.414-0 0.75-0.336 0.75-0.75v0-12.207c-0-0.414-0.336-0.75-0.75-0.75v0zM23.258 12.206l-4.76-1.394c-0.062-0.019-0.134-0.030-0.208-0.030-0.001 0-0.002 0-0.003 0h-3.89c-0.883 0-1.196-0.522-1.196-0.97s0.313-0.97 1.196-0.97h6.809c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-7.782c-0.111 0-0.217 0.024-0.312 0.067l0.005-0.002-7.793 3.503c-0.287 0.132-0.624 0.21-0.978 0.21-0.266 0-0.522-0.043-0.76-0.124l0.017 0.005c-0.382-0.229-0.657-0.604-0.751-1.045l-0.002-0.011c0.136-0.159 0.278-0.303 0.431-0.435l0.005-0.004c0.413-0.373 0.861-0.732 1.33-1.063l0.045-0.030c1.132-0.821 2.407-1.646 4.013-2.596 0.348-0.207 0.693-0.421 1.038-0.634 0.854-0.573 1.836-1.119 2.864-1.583l0.129-0.052c1.153-0.474 2.491-0.75 3.894-0.75 1.202 0 2.357 0.202 3.433 0.575l-0.074-0.022c1.554 0.647 3.362 1.145 5.245 1.409l0.118 0.014v7.434zM29.201 13.713h-2.383v-10.707h2.383z"></path> </g></svg>
      </div>
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {data?.patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"
            >
              <h3 className={`text-base sm:text-${fontSize} font-medium break-words`}>{patient.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>)
  }
  const IntensiveComponent = () => {
    const [groups, setGroups] = useState<number>(1);
    return (<div className="mb-6">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Lista nomes Irradiacao Intensiva ({data?.uti_count})</h2>
        <svg className="fill-current" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="-3.14 -3.14 37.64 37.64" xmlSpace="preserve" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.125428"></g><g id="SVGRepo_iconCarrier"> <g> <g>
          <path d="M15.679,0C7.033,0,0.001,7.033,0.001,15.678c0,8.646,7.032,15.68,15.678,15.68c8.644,0,15.677-7.033,15.677-15.68 C31.356,7.033,24.323,0,15.679,0z M15.679,28.861c-7.27,0-13.183-5.913-13.183-13.184c0-7.268,5.913-13.183,13.183-13.183 c7.269,0,13.182,5.915,13.182,13.183C28.861,22.948,22.948,28.861,15.679,28.861z"></path> <path d="M19.243,12.368V7.33c0-0.868-0.703-1.57-1.57-1.57h-3.396c-0.867,0-1.569,0.703-1.569,1.57v5.038h-5.04 c-0.867,0-1.569,0.703-1.569,1.57v3.468c0,0.867,0.702,1.57,1.569,1.57h5.039v5.037c0,0.867,0.702,1.57,1.569,1.57h3.397 c0.866,0,1.569-0.703,1.569-1.57v-5.037h5.038c0.867,0,1.57-0.703,1.57-1.57v-3.468c0-0.868-0.703-1.57-1.57-1.57H19.243z">
          </path> </g> </g> </g></svg>
      </div>
      <div className="mb-4">
        <select
          className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={groups}
          onChange={e => setGroups(Number(e.target.value))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
        <span className="max-sm:hidden pl-5 text-gray-700">Dividir em grupos</span>
      </div>
      <div className="space-y-4">
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(groups, 3)} lg:grid-cols-${Math.min(groups, 4)} xl:grid-cols-${groups} gap-x-4 sm:gap-x-8 md:gap-x-15 lg:gap-x-30 gap-y-4 mb-6`}>
          {data?.utis.map((patient) => (
            <div
              key={patient.id}
              className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"
            >
              <div>
                <h3 className={`text-base sm:text-${fontSize} font-medium break-words`}>{patient.name}</h3>
                {new Date(patient.birthday.slice(0, -1)).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>)
  }

  const LocalComponent = () => {
    return (<div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-15 px-4">
      <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#323232" strokeWidth="2"></path> <path d="M12 3.05554C14.455 5.25282 16 8.44597 16 12C16 15.554 14.455 18.7471 12 20.9444" stroke="#323232" strokeWidth="2" strokeLinecap="round"></path> <path d="M12.0625 21C9.57126 18.8012 8 15.5841 8 12C8 8.41592 9.57126 5.19883 12.0625 3" stroke="#323232" strokeWidth="2" strokeLinecap="round"></path> <path d="M3 12H21" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
      <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white text-center break-words">{data?.place}</h2>
    </div>)
  }

  const AveMaria = ({ vertical }: { vertical: boolean }) => {

    return (<div className={`p-2 mb-2 ${vertical ? 'mt-20' : ''}`}>
      <h1 className={`text-2xl font-bold text-center text-blue-700 mb-2 ${vertical ? 'mb-15' : ''}`}>AVE MARIA MÂNTRICA</h1>
      <p className={`text-xl text-gray-800 text-center leading-relaxed ${vertical ? 'mb-10' : ''}`}>
        AVE MARIA, CHEIA DE GRAÇA, O SENHOR É CONVOSCO.
      </p>
      <p className={`text-xl text-gray-800 text-center leading-relaxed ${vertical ? 'mb-10' : ''}`}>
        BENDITA SOIS VÓS ENTRE AS MULHERES, E BENDITO É O FRUTO DE VOSSO VENTRE JESUS.
      </p>
      <p className={`text-xl text-gray-800 text-center leading-relaxed ${vertical ? 'mb-10' : ''}`}>
        SANTA MARIA, MÃE DE DEUS, ROGAI POR NÓS FILHOS E FILHAS DE DEUS,
      </p>
      <p className={`text-xl text-gray-800 text-center leading-relaxed ${vertical ? 'mb-10' : ''}`}>
        AGORA E NA HORA DA NOSSA VITÓRIA, SOBRE O PECADO, A DOENÇA E A MORTE.
      </p>
    </div>)
  }

  const MembersComponent = () => {
    return (<div className="mb-6">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Lista de Membros da Comunidade ({members?.length})</h2>
      </div>
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {members?.map((member) => (
            <div
              key={member.id}
              className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"
            >
              <h3 className={`text-base sm:text-${fontSize} font-medium break-words`}>{member.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>)
  }

  const tabItems: TabItem[] = [
    // { label: 'Dados', content: InfoComponent, },
    { label: 'Geral', content: GeralComponent },
    { label: 'Intensiva', content: IntensiveComponent },
    { label: 'Local', content: LocalComponent },
    { label: 'Membros', content: MembersComponent },
  ];

  useEffect(() => {
    setLoading(true)
    if (router.query.slug == undefined) {
      return
    }
    const id = (router.query.slug as string)
    AxiosInstance.get<Session>(`/api/session/${id}`).then(resp => {
      if (resp.status == 200) {
        setData(resp.data);
      }
      AxiosInstance.get<Member[]>(`/api/members`).then(resp => {
        if (resp.status == 200) {
          setMembers(resp.data)
        }
      })

    }).finally(() => { setLoading(false) })
  }, [router])

  // const onCancel = () => {
  //   router.back()
  // }

  const fScreen = () => {
    return (
      <div>
        <div className="flex flex-row">
          <div className="basis-1/5">
            <AveMaria vertical={true}></AveMaria>
          </div>
          <div className="basis-4/5">
            <Tabs tabs={tabItems} onFontChange={setFontSize} />
          </div>
        </div>
        <button
          onClick={() => { setFullScreen(false) }}
          className="ml-2 flex items-center justify-center p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <MinimizeIcon></MinimizeIcon>
          Voltar
        </button>
      </div>
    )
  }

  const nScreen = () => {
    return (<DefaultLayout>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className={`lg:col-span-5`}>
          <AveMaria vertical={false}></AveMaria>
        </div>
        <div className="flex flex-row lg:flex-col gap-2">
          {!data?.done ? (<div className="flex items-end mb-2">
            <button
              onClick={() => { setShowModal(true) }}
              disabled={loading}
              className={"rounded-md w-full border border-primary py-2 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"}>
              <span className="">
                Finalizar Sessão
              </span>
            </button>
          </div>) : (<div><span className="inline-block rounded bg-meta-3/[0.08] px-2.5 py-1 text-sm font-medium text-meta-3">Finalizada</span></div>)}
          <button
            onClick={() => { setFullScreen(true) }}
            className="mt-10 flex items-center justify-center p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <MaximizeIcon></MaximizeIcon>
            Tela cheia
          </button>
        </div>
      </div>
      <Tabs tabs={tabItems} onFontChange={setFontSize} />
    </DefaultLayout>)
  }

  return (<div>
    {loading ? <DefaultLayout><LoadingSpinner></LoadingSpinner></DefaultLayout> :
      data != undefined ?
        fullScreen ? fScreen() : nScreen()

        : <DefaultLayout><p>Nao foi possivel carregar</p></DefaultLayout>}
    <Modal showModal={showModal} loading={loading} title='Confirmar' saveText='Sim, finalizar' onClose={() => { setShowModal(false) }} onAccept={fisnishSession}>
      <p> Os nomes do tratamento intensivo serão removidos da fila. </p>
      <p> Deseja finalizar a sesão ? </p>
    </Modal>
  </div>)
}