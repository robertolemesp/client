'use client'
import type { FC } from 'react'
import type { CustomerDto } from '@/application/dto/customer'

import Table from '@/application/presentation/shared/ui/table'
import CustomerListTableRowActions from '@/application/presentation/customer/table/row/actions'
import Spinner from '@/application/presentation/shared/ui/spinner'
import { formatDateToBrazilianFormat } from '../../../../utils/date'

export interface CustomerTableProps {
  className?: string
  isLoading?: boolean
  customers: CustomerDto[]
  itemsPerPage: number
  onCellClick?: (row: CustomerDto, column: keyof CustomerDto | string | number | symbol) => void
  onEditCustomer?: (customerId: CustomerDto['id']) => void
  onRemoveCustomer?: (customerId: CustomerDto['id']) => void
}

const CustomerTable: FC<CustomerTableProps> = ({ className, isLoading, customers, itemsPerPage, onCellClick, onEditCustomer, onRemoveCustomer }) => {

  const handleEditActionIconClick = (customerId: CustomerDto['id']): void => onEditCustomer?.(customerId)

  const handleRemoveActionIconClick = (customerId: CustomerDto['id']): void => onRemoveCustomer?.(customerId)

  const handleCellClick = (row: CustomerDto, column: keyof CustomerDto | string | number | symbol): void => onCellClick?.(row, column)

  const getDisplayableData = (customers: CustomerDto[]) => 
    customers.map(customer => ({ 
      ...customer, 
      birthday: formatDateToBrazilianFormat(customer.birthday) 
    }))
  
  if (isLoading)
    return <Spinner />

  return <Table<CustomerDto>
    domElementsClassNames={{
      container: `w-full min-w-min bg-black text-white shadow-sm rounded-lg ${className}`,
      table: 'w-full max-w-full border-collapse ring-1 ring-primary-600 bg-primary-600 rounded-lg',
      thead: 'bg-primary-600',
      th: 'py-4 border-b bg-primary-600 text-white rounded-lg',
      tr: 'py-2 text-center',
      td: 'py-2 bg-black border-b min-w-48',
      footer: 'w-full'
    }}
    data={getDisplayableData(customers)}
    dataItemIndexKey='id'
    columns={[
      { label: 'Nome', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Nascimento', key: 'birthday' },
      { label: 'RG', key: 'rg' },
      { label: 'CPF', key: 'cpf' },
      { label: 'Telefone', key: 'phone' },
      { label: 'Nascimento', key: 'birthday' },
      { label: 'Endereços', key: 'addresses', wrapped: true },
    ]}
    itemsPerPage={itemsPerPage}
    onCellClick={handleCellClick}
    actions={(customerId) => (
      <CustomerListTableRowActions
        className='justify-center'
        customerId={customerId as CustomerDto['id']}
        onEdit={handleEditActionIconClick}
        onRemove={handleRemoveActionIconClick}
      />
    )}
  />
}

export default CustomerTable
