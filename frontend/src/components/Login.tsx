import AxiosInstance from '@/utils/axiosInstance';
import React, { useState } from 'react';
import Modal from './Modal';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import ApiError from '@/types/api-error';

const LoginComponent: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const onAccpet = () => {
    setLoading(true)
    if (name.trim().length === 0) return

    AxiosInstance.post('/api/pub/patients', { name: name }).then(r => {
      if (r.status == 200) {
        router.push('/registrado', { query: { name: name, status: "success" } })
      } else {
        router.push('/registrado', { query: { name: name, status: "error" } })
      }
    })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ApiError>
          if (axiosError.response?.data.message == 'already exists') {
            router.push('/registrado', { query: { name: name, status: "already-exists" } })
          } else {
            router.push('/registrado', { query: { name: name, status: "error" } })
          }
        } else {
          router.push('/registrado', { query: { name: name, status: "error" } })
        }
      })
      .finally(() => { setLoading(false); setName(''); setShowModal(false) })
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className='flex flex-col items-center'>
            <h1 className='font-semibold text-indigo-500 text-xl'>Comunidade da Ação 🍀 Irradiação</h1>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Entrar
            </h1>
            <p className="mt-4 text-xs text-gray-600 text-center">
              Adicionar múltiplos nomes, verificar status, renovar validade, solicitar tratamento intensivo e receber notificações
            </p>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">

                <button
                  onClick={() => { location.href = `${apiUrl}/auth/google/login` }}
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4" />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853" />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04" />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335" />
                    </svg>
                  </div>
                  <span className="ml-4">
                    Continuar com Google
                  </span>
                </button>

                <button
                  onClick={() => { location.href = `${apiUrl}/auth/facebook/login` }}
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 48 48">
                      <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
                          <path
                            d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
                            id="Facebook">

                          </path>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <span className="ml-4">
                    Continuar com Facebook
                  </span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div
                  className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Ou simplesmente indique um nome
                </div>
              </div>

              <div className="mx-auto max-w-xs">
                <input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (name.trim().length === 0) return
                      setName(name.trim())
                      setShowModal(true)
                    }
                  }}
                  onChange={(event) => {
                    setError(event.target.value.includes(','))
                    setName(event.target.value)
                  }}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text" placeholder="Nome para irradiação" value={name} />
                {error ? (<span className="mt-1 text-xs text-red-400">
                  Digite apenas um nome por vez
                </span>) : <span className='mt-1 text-xs'> &nbsp;</span>}
                <button
                  onClick={() => {
                    if (name.trim().length === 0) return
                    setName(name.trim())
                    setShowModal(true)
                  }}
                  disabled={loading || error}
                  className={"mt-2 tracking-wide font-semibold " + (error ? 'bg-gray-500' : 'bg-indigo-500') + " text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"}>
                  <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">
                    Registrar nome
                  </span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Nomes registrados sem cadastro serão válidos por somente uma irradiação
                </p>
                <p className="mt-2 text-xs text-gray-600 text-center">
                  Para nomes de terceiros é imprescindível que a pessoa saiba e <b>autorize</b> a energização
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://heliogabriel.com/wp-content/webp-express/webp-images/uploads/2022/10/Helio-Foto-1024x1024.jpg.webp')" }}>
          </div>
        </div>
      </div>
      <Modal showModal={showModal} loading={loading} title='Autorização' saveText='Sim, registrar' onClose={() => { setShowModal(false) }} onAccept={() => { onAccpet() }}>
        <p> Para nomes de terceiros é imprescindível que a pessoa saiba e autorize a energização. </p>
        <br></br>
        <p> Deseja registar <b>{name}</b> para próxima sessão de irradiação ? </p>
      </Modal>
    </div>
  );
};

export default LoginComponent;