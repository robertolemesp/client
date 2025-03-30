'use client'
import { type FC, type JSX, useEffect, useState } from 'react'

import type { Customer } from '@/domain/customer/model'
import { ErrorEntity } from '@/domain/error/entity'
import type { CustomerDto } from '@/application/dto/customer'
import type { FormActionState } from '@/application/presentation/shared/ui/form/index.d'

import { CustomerService } from '@/application/services/customer'

import SignOut from '@/application/presentation/authentication/sign-out'
import CustomerTableToolbar from '@/application/presentation/customer/table/toolbar'
import CustomerTable from '@/application/presentation/customer/table'

import Modal from '@/application/presentation/shared/ui/modal'   
import CustomerForm from '@/application/presentation/customer/form'
import AddressList from '@/application/presentation/address/list'


type FormModalMode = 'creation' | 'edition' | null
type CustomerId = Customer['id']

const CustomerPageContent: FC = (): JSX.Element => {
  const customerService = new CustomerService()

  const [ currentCustomers, setCurrentCustomers ] = useState<CustomerDto[]>([])
  const [ currentCustomer, setCurrentCustomer ] = useState<CustomerDto | null>(null)
  const [ isCustomerFormModalEnabled, setIsCustomerFormModalEnabled ] = useState<boolean>(false)
  const [ customerFormModalMode, setCustomerFormModalMode ] = useState<FormModalMode>(null)
  const [ isAddressListModalEnabled, setIsAddressListModalEnabled ] = useState<boolean>(false)

  const handleAddCustomerToolbarButtonClick = (): void => {
    setCurrentCustomer(null)
    setCustomerFormModalMode('creation')
    setIsCustomerFormModalEnabled(true)
  }

  const handleEditActionIconClick = (customerId: CustomerId): void => {
    const customer = currentCustomers.find(currentCustomer => currentCustomer.id === customerId)
    if (!customer) 
      return

    setCurrentCustomer(customer)
    setCustomerFormModalMode('edition')
    setIsCustomerFormModalEnabled(true)
  }

  const handleRemoveActionIconClick = async (customerId: CustomerId): Promise<void> => {
    const customerIndex = currentCustomers.findIndex(c => c.id === customerId)
    const customer = currentCustomers[customerIndex]

    if (!customer?.id || !window.confirm(`Confirma a remoção do Cliente\n${customer.name}?`)) 
      return

    await customerService.removeCustomer({ id: customer.id })
    
    setCurrentCustomers(customers => [
      ...customers.slice(0, customerIndex),
      ...customers.slice(customerIndex + 1),
    ])
  }

  const handleAddressCellClick = (row: CustomerDto) => {
    setCurrentCustomer(row)
    setIsAddressListModalEnabled(true)
  }

  const handleCellClick = (row: CustomerDto, column: keyof CustomerDto | string | number | symbol): void => {
    switch(column) {
      case 'addresses':
        handleAddressCellClick(row)
        break
      default:
    }
  }

  const handleCustomerFormActionStateChange = (state: FormActionState): void => {
    if (!state?.success || !state.payload) 
      return
  
    if (customerFormModalMode === 'creation')
      setCurrentCustomers(customers => [ ...customers, state.payload as CustomerDto ])

    if (customerFormModalMode === 'edition') 
      setCurrentCustomers(customers => {
        const updatedCustomer = state.payload as CustomerDto
        const foundCustomerIndex = customers.findIndex(findingCustomer => findingCustomer.id === updatedCustomer?.id)
        
        if (foundCustomerIndex > -1)
          customers[foundCustomerIndex] = updatedCustomer

        return customers
      })
        
    setIsCustomerFormModalEnabled(false)
  }

  const handleCustomerFormModalClose = (): void => setIsCustomerFormModalEnabled(false)

  const handleAddressListModalClose = (): void =>  setIsAddressListModalEnabled(false)

  const getCustomerDialogFormTitle = (): string => {
    if (!customerFormModalMode)
      return ''

    return customerFormModalMode === 'creation' ? 
      'Novo Cliente' 
    : 
      `Cliente:${` ${currentCustomer?.name}` || ''}`
  }

  const getAndSetCustomers = async () => {
    try {
      const customers = await new CustomerService().getCustomers()

      if (Array.isArray(customers))
        setCurrentCustomers(customers)
    } catch (error) {
      if (error instanceof ErrorEntity)
        setTimeout(() => console.error(`Failed to get customers: ${error.message}`), 0)
    }
  }

  useEffect(() => {
    (async () => getAndSetCustomers())()
  }, [])

  return <section className='flex flex-col w-full h-full'>
    <div className='flex justify-between items-center px-4 sm:px-6 py-6'>
      <h1 className='text-2xl font-bold text-black drop-shadow-lg'>Painel Administrativo</h1>
      <SignOut className='text-2xl' />
    </div>
    <div className='mt-8 py-8 px-4 shadow-xl rounded-md overflow-auto'>
      <CustomerTableToolbar onAddCustomerButtonClick={handleAddCustomerToolbarButtonClick} />

      <CustomerTable
        className='mt-6'
        customers={currentCustomers}
        itemsPerPage={10}
        onCellClick={handleCellClick}
        onEditCustomer={handleEditActionIconClick}
        onRemoveCustomer={handleRemoveActionIconClick}
      />
    </div>
    { isCustomerFormModalEnabled && <Modal  
        title={getCustomerDialogFormTitle()}
        onClose={handleCustomerFormModalClose}
      >
        <CustomerForm 
          mode={customerFormModalMode}
          customer={currentCustomer}
          onFormActionStateChange={handleCustomerFormActionStateChange} 
        />
      </Modal> 
    }
    { isAddressListModalEnabled && <Modal 
        title='Lista de Endereços' 
        onClose={handleAddressListModalClose}
      >
        <AddressList 
          className='px-4 sm:px-6 mt-12' 
          addresses={currentCustomer?.addresses}
        />
      </Modal> 
    }
  </section>
}

export default CustomerPageContent
