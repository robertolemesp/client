import type{ FC } from 'react'

import BaseButton from '@/application/presentation/shared/ui/button'
import AddIcon from '@/application/presentation/shared/ui/table/actions/add'

interface CustomerTableToolbarProps {
  onAddCustomerButtonClick: () => void
}

const CustomerTableToolbar: FC<CustomerTableToolbarProps> = ({ onAddCustomerButtonClick }) => {
  const handleAddCustomerButtonClick = onAddCustomerButtonClick
  
  return <div className='flex flex-wrap gap-y-6 gap-x-2 justify-center xsm:justify-between items-center w-full py-6 sm:py-4 px-4 ring-2 rounded-md shadow-md bg-black ring-white'>
    <h1 className='text-2xl font-bold text-white mr-2'>Clientes</h1>
    <BaseButton
      onClick={handleAddCustomerButtonClick}
      className='add-customer-button flex flex-wrap justify-center items-center gap-3 py-2 px-4 w-full max-w-48 min-h-12 h-auto font-bold bg-primary-500 text-white rounded cursor-pointer'
    >
      Adicionar Cliente
      <AddIcon />
    </BaseButton>
  </div>
}

export default CustomerTableToolbar
