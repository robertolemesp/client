'use client'
import { type JSX, useState } from 'react'

import { mergeClassNames } from '@/utils/classname'

export interface Column<T> {
  label: string
  key: keyof T
  wrapped?: boolean
}

interface TableProps<T> {
  domElementsClassNames?: {
    container?: string
    table?: string
    thead?: string
    th?: string
    tr?: string
    td?: string
    footer?: string
  }
  data: T[]
  dataItemIndexKey: keyof T
  columns: Column<T>[]
  itemsPerPage?: number
  onCellClick: (row: T, key: keyof T | string | number | symbol) => void
  actions: (id?: T[keyof T]) => JSX.Element
}

const Table = <T,>(
  { domElementsClassNames, data, dataItemIndexKey, columns, itemsPerPage = 10, onCellClick, actions }: TableProps<T>
): JSX.Element => {
  const [ currentPage, setCurrentPage ] = useState(0)

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const paginatedData = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const handleCellClick = onCellClick

  const getCellContent = (row: T, column: Column<T>): string | JSX.Element =>
    column.wrapped ? 
      <span 
        className='cursor-pointer'
        onClick={() => handleCellClick(row, column.key)}
      >
        Ver
      </span>
    : 
      typeof row[column.key] === 'object' && row[column.key] !== null
        ? row[column.key] as JSX.Element
        : String(row[column.key]) 

  const handlePageChange = (next: boolean) => 
    setCurrentPage(prevPage => Math.max(0, Math.min(prevPage + (next ? 1 : -1), totalPages - 1)))

  return <div className={mergeClassNames('w-full rounded-lg', domElementsClassNames?.container)}>
    <table className={domElementsClassNames?.table}>
      <thead className={domElementsClassNames?.thead}>
        <tr className={domElementsClassNames?.tr}>
          {columns.map((column, i) => 
            <th key={i} className={domElementsClassNames?.th}>{ column.label }</th>
          )}
          <th className={domElementsClassNames?.th}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((row, rowIndex) => 
          <tr key={rowIndex} className={domElementsClassNames?.tr}>
            {columns.map((column, i) => (
              <td key={i} className={domElementsClassNames?.td}>
                {getCellContent(row, column)}
              </td>
            ))}
            <td className={mergeClassNames(domElementsClassNames?.td, 'max-w-24')}>{actions(row[dataItemIndexKey])}</td>
          </tr>
        )}
      </tbody>
    </table>
    <div className={
      mergeClassNames('flex justify-start sm:justify-end py-4 px-3', domElementsClassNames?.footer)
    }>
      <button 
        className='px-4 py-2 mx-1 bg-primary-600 rounded-sm cursor-pointer transform rotate-180'
        onClick={() => handlePageChange(false)} 
        disabled={currentPage === 0}
      >
        ➜
      </button>
      <span className='px-4 py-2'>
        {currentPage + 1} / {totalPages}
      </span>
      <button 
        className='px-4 py-2 mx-1 bg-primary-600 rounded-sm cursor-pointer'
        onClick={() => handlePageChange(true)} 
        disabled={currentPage === totalPages - 1}
      >
        ➜
      </button>
    </div>
  </div>
}

export default Table
