import { useState } from "react";
import DatePickerOne from "./DatePickerOne";
import Table from "./Table";
import { Column } from "./Table";
import Patient from "@/types/patient";
import UtiPatient from "@/types/UtiPatient";

const getDaysDiff = (dateStr: string): string => {
  const days = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 1
  return `${(days > 1 ? days + ' dias' : days == 0 ? '1 dia' : days + ' dia')}`
}

const columns: Column<Patient>[] = [
  { key: 'name', label: 'Nome', sortable: true },
  // { key: 'age', label: 'Age', render: (value) => <span className="text-green-600">{value} years</span> },
  {
    key: 'validity', label: 'Validade', sortable: true, render(value, row) {
      return (<p
        className={`inline-flex min-w-${row.expired ? '20' : '35'} rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${!row.expired
          ? "bg-success text-success"
          : "bg-danger text-danger"
          }`}
      >
        {!row.expired ? `Válido por ${getDaysDiff(row.validity)}` : 'Expirado'}
      </p>)
      // return !row.expired ? `Válido por ${getDaysDiff(row.validity)}` : 'Expirado'    
    },
  }
];

const columnsUti: Column<UtiPatient>[] = [
  { key: 'position', label: 'Posicao', sortable: true },
  { key: 'name', label: 'Nome', sortable: true },
  {
    key: 'birthday', label: 'Nascimento', sortable: true, render(value, row) {
      return (<p>{new Date(row.birthday).toLocaleDateString('pt-BR')}</p>)
    },
  },
  // { key: 'age', label: 'Age', render: (value) => <span className="text-green-600">{value} years</span> },
];

interface SessionFormProps {
  onSave: (title: string, place: string, desc: string, data: Date, patients: Set<string | number>, utis: Set<string | number>) => void;
  onCancel: () => void;
  patients: Patient[];
  selectedPatients: Set<string | number>;
  onSelectedRowsChange: (selectedRows: Set<string | number>) => void;
  utis: UtiPatient[];
  selectedUtis: Set<string | number>;
  onSelectedUtiChange: (selectedRows: Set<string | number>) => void;
  initTitle: string;
  initDesc: string;
  initPlace: string;
  initData: Date | undefined;
}


export default function SessionForm({
  onSave,
  onCancel,
  patients,
  selectedPatients: selectedRows,
  onSelectedRowsChange,
  utis,
  selectedUtis,
  onSelectedUtiChange,
  initTitle,
  initDesc,
  initPlace,
  initData
}: SessionFormProps
) {
  const [title, setTitle] = useState(initTitle)
  const [place, setPlace] = useState(initPlace)
  const [desc, setDesc] = useState(initDesc)
  const [data, setData] = useState<Date | undefined>(initData)
  // const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  return (<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">
        Sessão de Irradiação
      </h3>
    </div>
    <div>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Título
            </label>
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(event) => { setTitle(event.target.value) }}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Data
            </label>
            <DatePickerOne defaultDate={data} hour={true} onDatePick={(date) => { setData(date) }} />
          </div>
        </div>
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Localidade para Irradiação
          </label>
          <input
            type="text"
            placeholder="Localidade"
            value={place}
            onChange={(event) => { setPlace(event.target.value) }}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Nomes Irradiação Geral
            <span className="text-xl font-normal">{` (${selectedRows.size} / ${patients.length})`}</span>
          </label>
          <Table data={patients} columns={columns} selectedRows={selectedRows} onSelectedRowsChange={onSelectedRowsChange} />
        </div>
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Nomes Irradiação Intensiva
            <span className="text-xl font-normal">{` (${selectedUtis.size} / ${utis.length})`}</span>
          </label>

          <Table data={utis} columns={columnsUti} selectedRows={selectedUtis} onSelectedRowsChange={onSelectedUtiChange} />
        </div>
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Notas
          </label>
          <textarea
            rows={6}
            value={desc}
            onChange={(event) => { setDesc(event.target.value) }}
            placeholder="Notas sobre esta sessão de irradiacao (opcional)"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-2">

          <button
            onClick={() => { onCancel() }}
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            Cancelar
          </button>
          <button
            onClick={() => {
              console.log('click')
              onSave(title, place, desc, data!, selectedRows, selectedUtis)
            }}
            disabled={title.length == 0 || data == undefined}
            className={` flex w-full justify-center ${title.length == 0 || data == undefined ? 'bg-gray-500' : 'bg-indigo-500'} rounded p-3 font-medium text-gray hover:bg-opacity-90`}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>)
}