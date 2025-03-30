import type { CustomerCreationDto } from '@/application/dto/customer/creation'
import type { CustomerUpdateDto } from '@/application/dto/customer/update'
import type { CustomerRemovalDto } from '@/application/dto/customer/removal'

import { CustomerService } from '.'

import { addressServiceMock } from '@/infrastructure/testing/jest/__mocks__/address-service'
import { customerValidationMock } from '@/infrastructure/testing/jest/__mocks__/customer-validation'
import { customerServiceErrorMessages, CustomerServiceErrors } from './types'

describe('Customer Service (Unit)', () => {
  let customerService: CustomerService

  const customersMock = [
    { id: 1, name: 'Roberto', email: 'roberto1@email.com', birthday: '11/01/1995', cpf: '123.456.789-00', rg: '12.345.678-8', phone: '(12) 34567-8901',  addresses: [] },
    { id: 2, name: 'Roberto 2', email: 'roberto2@email.com', birthday: '11/01/1995', cpf: '123.456.789-01', rg: '12.345.678-9', phone: '(12) 34567-8902',  addresses: [] },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    customerService = new CustomerService()
  })

  it('creates a customer successfully', async () => {
    jest.spyOn(customerService, 'createCustomer').mockResolvedValue(customersMock[1])

    const payload: CustomerCreationDto = {
      name: 'Roberto',
      email: 'roberto@email.com',
      birthday: '1995-01-11',
      cpf: '123.456.789-00',
      rg: '12.345.678-8',
      phone: '(12) 34567-8901',
      addresses: []
    }
    
    const result = await customerService.createCustomer(payload)

    expect(result).toEqual(customersMock[1])
    expect(customerService.createCustomer).toHaveBeenCalledWith(payload)
  })

  it('fails to create a customer due to validation error', async () => {
    const errorMessage = 'Customer and Address Validation failed'

    jest.spyOn(customerValidationMock, 'validateCreationDto').mockImplementation(() => {
      throw new Error(errorMessage)
    })
    jest.spyOn(customerService, 'createCustomer').mockImplementation(async () => {
      throw new Error(errorMessage)
    })

    const payload: CustomerCreationDto = {
      name: '',
      email: 'invalid-email',
      birthday: '',
      cpf: '',
      rg: '',
      phone: '',
      addresses: []
    }

    await expect(customerService.createCustomer(payload)).rejects.toThrow(errorMessage)
  })

  it('updates a customer successfully', async () => {
    jest.spyOn(customerService, 'updateCustomer').mockResolvedValue({})
    jest.spyOn(addressServiceMock, 'updateAddress').mockResolvedValue({ addresses: [] })
  
    const payload: CustomerUpdateDto = {
      id: 1,
      name: 'Roberto Updated',
      birthday: '1990-01-01',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      phone: '(12) 34567-8901',
      addresses: []
    }
  
    await customerService.updateCustomer(payload)
  
    expect(customerService.updateCustomer).toHaveBeenCalledWith(payload)
  })
  
  
  it('retrieves customers successfully', async () => {
    jest.spyOn(customerService, 'getCustomers').mockResolvedValue(customersMock)

    const result = await customerService.getCustomers()
    expect(result).toEqual(customersMock)
    expect(customerService.getCustomers).toHaveBeenCalled()
  })

  it('removes a customer successfully', async () => {
    jest.spyOn(customerService, 'removeCustomer').mockResolvedValue(undefined)

    const payload: CustomerRemovalDto = { id: 1 }
    await customerService.removeCustomer(payload)
    expect(customerService.removeCustomer).toHaveBeenCalledWith(payload)
  })

  it('fails to remove a customer due to validation error', async () => {
    const errorMessage = 'Invalid customer ID'

    jest.spyOn(customerService, 'removeCustomer').mockImplementation(async () => {
      throw new Error(errorMessage)
    })
  
    jest.spyOn(customerValidationMock, 'validateRemovalDto').mockImplementation(() => {
      throw new Error(errorMessage)
    })
  
    const payload: CustomerRemovalDto = { id: NaN }
  
    await expect(customerService.removeCustomer(payload)).rejects.toThrow(errorMessage)
  })
  
  it('formats customer fields correctly', () => {
    jest.spyOn(customerService, 'formatCustomerField').mockReturnValueOnce('123.456.789-00')

    expect(customerService.formatCustomerField('cpf', '12345678900')).toBe('123.456.789-00')
  })

  it('gets customer service error message for a known type', () => {
    const message = customerService.getCustomerServiceErrorMessage(CustomerServiceErrors.CREATE)

    expect(message).toBe(customerServiceErrorMessages[CustomerServiceErrors.CREATE])
  })
})
