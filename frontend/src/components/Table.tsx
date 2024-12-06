import React, { useState, useMemo, ReactNode } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T extends { id: number | string }> {
  data: T[];
  columns: Column<T>[];
  // selectedRows: (number | string)[]
  selectedRows?: Set<string | number>;
  onSelectedRowsChange?: (selectedRows: Set<string | number>) => void;
}

function Table<T extends { id: number | string }>({
  data,
  columns,
  selectedRows = new Set<string | number>(),
  onSelectedRowsChange
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'ascending' | 'descending';
  }>({ key: null, direction: 'ascending' });

  const handleSort = (key: keyof T) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() =>
    sortedData.filter(row =>
      columns.some(col =>
        String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    [sortedData, searchTerm, columns]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleRowSelect = (id: number | string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) { newSelectedRows.delete(id) } else { newSelectedRows.add(id) };
    onSelectedRowsChange?.(newSelectedRows);
  };

  const isAllRowsSelected = paginatedData.length > 0 &&
    paginatedData.every(row => selectedRows.has(row.id));

  const handleSelectAll = () => {
    const newSelectedRows = selectedRows.size === filteredData.length
      ? new Set<string | number>()
      : new Set(filteredData.map(row => row.id));
    onSelectedRowsChange?.(newSelectedRows);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full xl:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={isAllRowsSelected}
                  onChange={handleSelectAll}
                  className="text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className={`p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && (
                      <span className="ml-2">
                        {sortConfig.key === column.key && (
                          sortConfig.direction === 'ascending' ? '▲' : '▼'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map(row => (
              <tr
                key={row.id}
                className={`
                  ${selectedRows.has(row.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  ${selectedRows.has(row.id) ? 'bg-opacity-50' : ''}
                  transition duration-150 ease-in-out
                `}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                    className="text-blue-600 rounded focus:ring-blue-500"
                  />
                </td>
                {columns.map(column => (
                  <td
                    key={String(column.key)}
                    className="p-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white px-4 py-3 flex items-center justify-between border-t sm:px-6">
        <div className="flex-1 flex justify-between items-center">
          <div>
            <select
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={rowsPerPage}
              onChange={e => setRowsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <span className="max-sm:hidden pl-5 text-sm text-gray-700">Registros por página</span>
          </div>
          <span className="pl-5 text-sm text-gray-700">
            Selecionados <span className="font-medium">{selectedRows.size}</span> de <span className="font-medium">{data.length}</span> items
          </span>

          <div className="flex space-x-2 items-center justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'<'}
            </button>

            <span className="text-sm text-gray-700">
              Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;