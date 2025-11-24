import { useState } from "react";
import DatePickerOne from "./DatePickerOne";

export default function UtiForm({ onSave, onCancel, initName, initDesc, initBirth }: { onSave: (name: string, desc: string, birth: Date) => void, onCancel: () => void, initName: string, initDesc: string, initBirth: Date | undefined }) {
  const [name, setName] = useState(initName)
  const [desc, setDesc] = useState(initDesc)
  const [birth, setBirth] = useState<Date | undefined>(initBirth)

  return (<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-4 sm:px-6.5 py-4 dark:border-strokedark">
      <h3 className="text-base sm:text-lg font-medium text-black dark:text-white">
        Tratamento Intensivo
      </h3>
    </div>
    <div>
      <div className="p-4 sm:p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Nome
            </label>
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(event) => { setName(event.target.value) }}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Data de Nascimento
            </label>
            <DatePickerOne defaultDate={birth} onDatePick={(date) => { setBirth(date) }} />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Descrição
          </label>
          <textarea
            rows={6}
            value={desc}
            onChange={(event) => { setDesc(event.target.value) }}
            placeholder="Descreve brevemente sobre a questão de saúde"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

          <button
            onClick={() => { onCancel() }}
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            Cancelar
          </button>
          <button
            onClick={() => {
              console.log('click')
              onSave(name, desc, birth!)
            }}
            disabled={name.length == 0 || birth == undefined}
            className={` flex w-full justify-center ${name.length == 0 || birth == undefined ? 'bg-gray-500' : 'bg-indigo-500'} rounded p-3 font-medium text-gray hover:bg-opacity-90`}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>)
}