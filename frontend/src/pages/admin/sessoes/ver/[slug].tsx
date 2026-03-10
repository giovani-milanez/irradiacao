
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import Tabs, { ChronometerStatus, TabItem } from "@/components/Tabs";
import Member from "@/types/member";
import Session from "@/types/Session";
import AxiosInstance from "@/utils/axiosInstance";
import { MaximizeIcon, MinimizeIcon } from "@/utils/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getImageMimeTypeFromBase64 = (base64: string): string => {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBORw0KGgo")) return "image/png";
  if (base64.startsWith("R0lGOD")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  if (base64.startsWith("Qk")) return "image/bmp";
  return "application/octet-stream";
};


export default function ViewSessionsPage() {
  const router = useRouter()
  const [data, setData] = useState<Session>()
  const [members, setMembers] = useState<Member[]>()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const [fontSize, setFontSize] = useState("lg")
  const [selectedTab, setSelectedTab] = useState(0)
  const [chronometerElapsedSeconds, setChronometerElapsedSeconds] = useState(0)
  const [chronometerStatus, setChronometerStatus] = useState<ChronometerStatus>('idle')

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
    return (<div className="flex flex-col justify-center items-center gap-4 mt-8 sm:mt-15 px-4">
      {/* <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#323232" strokeWidth="2"></path> <path d="M12 3.05554C14.455 5.25282 16 8.44597 16 12C16 15.554 14.455 18.7471 12 20.9444" stroke="#323232" strokeWidth="2" strokeLinecap="round"></path> <path d="M12.0625 21C9.57126 18.8012 8 15.5841 8 12C8 8.41592 9.57126 5.19883 12.0625 3" stroke="#323232" strokeWidth="2" strokeLinecap="round"></path> <path d="M3 12H21" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> */}
      <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white text-center break-words">{data?.place}</h2>
      {data?.place_img ? (
        <img
          src={`data:${getImageMimeTypeFromBase64(data.place_img)};base64,${data.place_img}`}
          alt="Imagem da localidade da sessão"
          className="max-h-72 rounded border border-stroke object-contain"
        />
      ) : null}
    </div>)
  }

  const AveMaria = ({ vertical }: { vertical: boolean }) => {

    return (<div className={`p-2 mb-2 ${vertical ? 'mt-20 max-h-screen overflow-y-auto pr-2' : ''}`}>
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
            <Tabs
              tabs={tabItems}
              onFontChange={setFontSize}
              activeTab={selectedTab}
              onTabChange={setSelectedTab}
              chronometerElapsedSeconds={chronometerElapsedSeconds}
              onChronometerElapsedSecondsChange={setChronometerElapsedSeconds}
              chronometerStatus={chronometerStatus}
              onChronometerStatusChange={setChronometerStatus}
            />
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
      <Tabs
        tabs={tabItems}
        onFontChange={setFontSize}
        activeTab={selectedTab}
        onTabChange={setSelectedTab}
        chronometerElapsedSeconds={chronometerElapsedSeconds}
        onChronometerElapsedSecondsChange={setChronometerElapsedSeconds}
        chronometerStatus={chronometerStatus}
        onChronometerStatusChange={setChronometerStatus}
      />
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