import { type CustomerServiceInterface, customerServiceErrorMessages, CustomerServiceErrors } from './types'
import type { ChangeEvent } from 'react'

import type { Customer } from '@/domain/customer/model'
import type { CustomerDto } from '@/application/dto/customer'
import type { CustomerCreationDto, CustomerCreationResultDto } from '@/application/dto/customer/creation'
import type { CustomerUpdateDto, CustomerUpdateResultDto } from '@/application/dto/customer/update'
import type { CustomerRemovalDto, CustomerRemovalResultDto } from '@/application/dto/customer/removal'
import type { AddressCreationDto } from '@/application/dto/address/creation'
import type { AddressUpdateDto } from '@/application/dto/address/update'
import type { ServiceErrorOrigin, ValidationErrorPayload } from '@/domain/error/model'
import { ErrorEntity } from '@/domain/error/entity'

import { AddressService } from '@/application/services/address'
import { CustomerValidator } from '@/domain/customer/services/validation'
import { AddressValidator } from '@/domain/address/services/validation'
import { errorService } from '@/application/services/error'

import HttpClient from '@/infrastructure/api/http-client'

export class CustomerService implements CustomerServiceInterface {
  private httpClient = HttpClient.getInstance()
  private ERROR_ORIGIN: ServiceErrorOrigin = 'Service Customer'

  constructor() {}
                                                                                          // v2: Add a Service Layer Called "cross-service-merger" Which only handles 
  validateCustomerAndAddressDtos = (customerCreationDto: CustomerCreationDto): void => {  // Crossed Services/Layers resources usage, like this case                                
    let hasCustomerErrors = false
    let hasAddressErrors = false

    const validationErrorsPayload: ValidationErrorPayload<CustomerCreationDto | AddressCreationDto> = []

    try {
      CustomerValidator.validateCreationDto(customerCreationDto)
    } catch (error) {
      if (errorService.isSystemError<CustomerCreationDto | AddressCreationDto>(error)) {
        hasCustomerErrors = true
        validationErrorsPayload.push(...error.payload as ValidationErrorPayload<CustomerCreationDto | AddressCreationDto>)
      }
    }

    try {
      AddressValidator.validateCreationDto({ addresses: customerCreationDto.addresses! })
    } catch (error) {
      if (errorService.isSystemError<CustomerCreationDto | AddressCreationDto>(error)) {
        hasAddressErrors = true
        validationErrorsPayload.push(...error.payload as ValidationErrorPayload<CustomerCreationDto | AddressCreationDto>)
      }
    }

    if (validationErrorsPayload.length > 0) {
      const errorOrigin: ServiceErrorOrigin[] = []

      if (hasCustomerErrors)
        errorOrigin.push(this.ERROR_ORIGIN)

      if (hasAddressErrors)
        errorOrigin.push('Service Address')
    
      throw errorService.generateServiceError(errorOrigin, validationErrorsPayload, this.getCustomerServiceErrorMessage(CustomerServiceErrors.CREATE))
    }
  }

  async createCustomer(customerCreationDto: CustomerCreationDto): Promise<CustomerCreationResultDto> {
    try {      
      this.validateCustomerAndAddressDtos(customerCreationDto)
      
      const addressCreationDto: AddressCreationDto = {
        addresses: customerCreationDto.addresses!
      }
      
      delete customerCreationDto.addresses
   
      const { data: createdCustomerDto } = await this.httpClient.post<CustomerCreationResultDto>('/customer', customerCreationDto)
      
      const addressService = new AddressService()

      addressCreationDto.addresses = addressCreationDto
        .addresses
        .map(address => ({ ...address, customerId: createdCustomerDto.id }))

      const createdAddressesDto  = await addressService.createAddress(addressCreationDto)

      createdCustomerDto.addresses = createdAddressesDto
      return createdCustomerDto
    } catch (error) {
      throw error
    }
  }

  async updateCustomer(customerUpdateDto: CustomerUpdateDto): Promise<CustomerUpdateResultDto> {
    const addressService = new AddressService()
    
    try {
      const addressUpdateDto: AddressUpdateDto = {
        customerId: customerUpdateDto.id,
        addresses: customerUpdateDto.addresses!
      }

      CustomerValidator.validateUpdateDto(customerUpdateDto)
      
      delete customerUpdateDto.addresses

      await this.httpClient.put<void>(`/customer/${customerUpdateDto.id}`, customerUpdateDto)

      const updateAddressDtoResult = await addressService.updateAddress(addressUpdateDto)

      return {
        ...customerUpdateDto,
        addresses: Array.isArray(updateAddressDtoResult) ? updateAddressDtoResult : addressUpdateDto.addresses
      }
    
    } catch (error) {
      if (error instanceof ErrorEntity) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getCustomerServiceErrorMessage(CustomerServiceErrors.UPDATE)
        )

      throw error  
    }
  }

  async getCustomers(): Promise<CustomerDto[] | void> {
    try {
      const { data: customers } = await this.httpClient.get<CustomerDto[]>('/customer')

      return customers.map((customer: Customer) => customer)
    } catch (error) {
      if (error instanceof ErrorEntity) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getCustomerServiceErrorMessage(CustomerServiceErrors.RETRIEVE_ALL)
        )

      throw error      
    }
  }

  async removeCustomer({ id }: CustomerRemovalDto): Promise<CustomerRemovalResultDto> {
    try {
      CustomerValidator.validateRemovalDto({ id })
      
      await this.httpClient.delete(`/customer/${id}`)
    } catch (error) {
      if (error instanceof ErrorEntity) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getCustomerServiceErrorMessage(CustomerServiceErrors.REMOVE)
        )

      throw error  
    }
  }

  formatCustomerField = (fieldName: keyof Customer | keyof CustomerDto, value: string): string => {
    
    const formatters: Record<keyof Customer | keyof CustomerDto, (value: string) => string> = {
      id: v => v,
      name: v => v,
      email: v => v,
      password: v => v,
      birthday: v => {
        v = v.replace(/\D/g, '')
        
        if (v.length >= 2) 
          v = v.replace(/^(\d{2})/, '$1/')

        if (v.length >= 5) 
          v = v.replace(/^(\d{2})\/(\d{2})/, '$1/$2/')
        
        return v
      },      
      cpf: v => v
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
      rg: v => v
        .replace(/\D/g, '') 
        .replace(/(\d{2})(\d)/, '$1.$2') 
        .replace(/(\d{3})(\d)/, '$1.$2') 
        .replace(/(\d{3})(\d)/, '$1-$2') 
        .replace(/(-\d)\d+?$/, '$1'),
      phone: v => { 
        const digits = v.replace(/\D/g, '')
        if (digits.length <= 10) 
          return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
        
        return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
      },
      addresses: v => v
    }
    
    const formatter = formatters[fieldName]
    const formattedValue = formatter(value)
  
    return formattedValue
  }
  
  maskCustomerFieldByName = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    event.target.value = this.formatCustomerField(name as keyof Customer | keyof CustomerDto, value)
  }

  getCustomerServiceErrorMessage = (errorType: CustomerServiceErrors): string =>
    errorService.getServiceErrorMessage(customerServiceErrorMessages, errorType)
}
