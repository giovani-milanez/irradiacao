import { useState } from "react";
import Modal from "./Modal";
import Session from "@/types/Session";

const SessionsTable = (
  { sessions, loading, onNewClick, onDeleteClick, onRowClick, onEditClick }:
    {
      sessions: Session[], loading: boolean,
      onNewClick: () => void, onDeleteClick: (id: number) => void, onRowClick: (id: number) => void,
      onEditClick: (id: number) => void
    }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedId, setSelectedId] = useState(0)

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="pb-2 border-b">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Lista de sessoes  ({sessions.length})
              </h4>
            </div>
            <button
              onClick={() => {
                onNewClick()
              }}
              disabled={loading}
              className={"font-semibold h-15 bg-indigo-500 text-gray-100 w-full rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"}>
              <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-3">
                Novo
              </span>
            </button>
          </div>
        </div>
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Titulo
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Data
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Lugar
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Qtd. Geral
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Qtd. Intensivo
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Acao
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((sessionItem, key) => (
              <tr key={key} className="hover:bg-blue-50">
                <td onClick={() => { onRowClick(sessionItem.id) }} className="cursor-pointer border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {sessionItem.title}
                  </h5>
                </td>
                <td
                  className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  {new Date(sessionItem.date).toLocaleString('pt-BR')}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {sessionItem.place}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {sessionItem.patients_count}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {sessionItem.uti_count}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {sessionItem.done ? (<span className="inline-block rounded bg-meta-3/[0.08] px-2.5 py-1 text-sm font-medium text-meta-3">Finalizada</span>) : (<span className="inline-block rounded bg-meta-8/[0.08] px-2.5 py-1 text-sm font-medium text-meta-8">Agendada</span>)}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" onClick={(evt) => { evt.preventDefault() }}>
                  <div className="flex items-center space-x-3.5">
                    <button onClick={() => { onEditClick(sessionItem.id) }} className="hover:text-primary">
                      <svg className="fill-current" width="18px" height="18px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Editar</title><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30.133 1.552c-1.090-1.044-2.291-1.573-3.574-1.573-2.006 0-3.47 1.296-3.87 1.693-0.564 0.558-19.786 19.788-19.786 19.788-0.126 0.126-0.217 0.284-0.264 0.456-0.433 1.602-2.605 8.71-2.627 8.782-0.112 0.364-0.012 0.761 0.256 1.029 0.193 0.192 0.45 0.295 0.713 0.295 0.104 0 0.208-0.016 0.31-0.049 0.073-0.024 7.41-2.395 8.618-2.756 0.159-0.048 0.305-0.134 0.423-0.251 0.763-0.754 18.691-18.483 19.881-19.712 1.231-1.268 1.843-2.59 1.819-3.925-0.025-1.319-0.664-2.589-1.901-3.776zM22.37 4.87c0.509 0.123 1.711 0.527 2.938 1.765 1.24 1.251 1.575 2.681 1.638 3.007-3.932 3.912-12.983 12.867-16.551 16.396-0.329-0.767-0.862-1.692-1.719-2.555-1.046-1.054-2.111-1.649-2.932-1.984 3.531-3.532 12.753-12.757 16.625-16.628zM4.387 23.186c0.55 0.146 1.691 0.57 2.854 1.742 0.896 0.904 1.319 1.9 1.509 2.508-1.39 0.447-4.434 1.497-6.367 2.121 0.573-1.886 1.541-4.822 2.004-6.371zM28.763 7.824c-0.041 0.042-0.109 0.11-0.19 0.192-0.316-0.814-0.87-1.86-1.831-2.828-0.981-0.989-1.976-1.572-2.773-1.917 0.068-0.067 0.12-0.12 0.141-0.14 0.114-0.113 1.153-1.106 2.447-1.106 0.745 0 1.477 0.34 2.175 1.010 0.828 0.795 1.256 1.579 1.27 2.331 0.014 0.768-0.404 1.595-1.24 2.458z"></path> </g></svg>
                    </button>
                    <button
                      onClick={(evt) => {
                        evt.preventDefault()
                        setSelectedId(sessionItem.id)
                        setShowDeleteModal(true)
                      }}
                      className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Excluir</title>
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sessions.length == 0 ? (<>
              <tr>
                <td colSpan={7} className="align-middle text-center border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="italic text-black dark:text-white">Nenhuma sessao registrada</p>
                </td>
              </tr>
            </>) : <></>}
          </tbody>
        </table>

      </div>

      <Modal showModal={showDeleteModal} loading={loading} title='Confirmar' saveText='Sim, excluir' onClose={() => { setShowDeleteModal(false) }} onAccept={() => {
        onDeleteClick(selectedId)
        setShowDeleteModal(false)
      }}>
        <p> Deseja excluir <b>{sessions.find(p => p.id == selectedId)?.title}</b> ? </p>
      </Modal>
    </div>
  );
};

export default SessionsTable;
