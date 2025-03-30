import { type AddressServiceInterface, AddressServiceErrors, addressServiceErrorMessages } from './types'
import type { ChangeEvent } from 'react'

import type { Address } from '@/domain/address/model'
import { AddressEntity } from '@/domain/address/entity'

import { ServiceErrorOrigin } from '@/domain/error/model'

import type { AddressDto, AddressesDto } from '@/application/dto/address'

import type { AddressCreationDto, AddressCreationResultDto } from '@/application/dto/address/creation'
import type { AddressUpdateDto, AddressUpdateResultDto } from '@/application/dto/address/update'
import type { AddressRemovalDto, AddressRemovalResultDto } from '@/application/dto/address/removal'

import { AddressValidator } from '@/domain/address/services/validation'
import { errorService } from '@/application/services/error'

import HttpClient from '@/infrastructure/api/http-client'

import { unprefixFormField, unindexFormField } from '@/utils/form'

export class AddressService implements AddressServiceInterface {
  private ERROR_ORIGIN: ServiceErrorOrigin = 'Service Address'
  private httpClient = HttpClient.getInstance()

  constructor() {}

  async createAddress(addressCreationDto: AddressCreationDto): Promise<AddressCreationResultDto> {
    try {
      AddressValidator.validateCreationDto(addressCreationDto)

      const { addresses } = addressCreationDto

      const { data: createdAddresses } = await this.httpClient.post<AddressCreationResultDto>(
        `/customer/${addresses[0].customerId}/address`, 
        addresses.map(creatingAddress => new AddressEntity(creatingAddress as Address))
      )

      return createdAddresses
    } catch (error) {
      if (errorService.isSystemError(error)) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getAddressServiceErrorMessage(AddressServiceErrors.CREATE)
        )

      throw error
    }
  }

  async updateAddress(addressUpdateDto: AddressUpdateDto): Promise<AddressUpdateResultDto> {
    try {
      AddressValidator.validateUpdateDto(addressUpdateDto)

      const { customerId, addresses } = addressUpdateDto

     const { data: addressUpdateResultDto } = await this.httpClient.put<AddressUpdateResultDto>(
        `/customer/${customerId}/address`, 
        addresses
      )

      return addressUpdateResultDto
    } catch (error) {
      if (errorService.isSystemError(error)) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getAddressServiceErrorMessage(AddressServiceErrors.UPDATE)
        )

      throw error
    }
  }

  async removeAddress(removAddressesDto: AddressRemovalDto): Promise<AddressRemovalResultDto> {
    try {
      AddressValidator.validateRemovalDto(removAddressesDto)

      const { customerId, addressIds } = removAddressesDto
      
      await this.httpClient.put<AddressRemovalResultDto>(`/customer/${customerId}/addresses`, addressIds)
    } catch (error) {
      if (errorService.isSystemError(error)) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getAddressServiceErrorMessage(AddressServiceErrors.REMOVE)
        )

      throw error
    }
  }

  extractAddressesFromParsedFormData<T>(parsedFormData: Record<keyof T, unknown>, customerId?: number): AddressesDto { 
    const addressesDto: AddressesDto = []
  
    const parseFormDataAdressFields = Object.keys(parsedFormData)
      .filter(key => key.startsWith('address_field_'))
      .map(key => {
        const parts = key.replace('address_field_', '').split('_')
  
        return { 
          key,
          index: parts.length > 1 ? parseInt(parts[1], 10) - 1 : 0, 
          fieldName: parts[0] as keyof AddressDto, 
        }
      })
      .filter(Boolean)
      .sort((a, b) => a!.index - b!.index)

    parseFormDataAdressFields.forEach(({ fieldName, index, key }) => {
      if (!addressesDto[index]) 
        addressesDto[index] = { 
          customerId,
          street: '',
          number: '',
          city: '',
          state: '',
          zipcode: ''
        }

      const fieldValue = parsedFormData[key as keyof T]

      if (typeof fieldValue !== 'string') {
        console.error(`Invalid value for ${key}:`, fieldValue)
        return
      }

      if (fieldName === 'id') {
        if (!fieldValue)
          return

        addressesDto[index][fieldName] = parseInt(fieldValue)
        return
      }

      addressesDto[index][fieldName] = fieldValue as never
    })

    return addressesDto
  }
  
  maskAddressFieldByName = (event: ChangeEvent<HTMLInputElement>, removalPrefix?: string, removeIndex?: boolean): void => {
    let { name } = event.target
    const { value } = event.target

    if (removalPrefix)
      name = unprefixFormField(removalPrefix, name)

    if (removeIndex)
      name = unindexFormField(name)
    
    const formatters: Record<keyof Address | keyof AddressDto, (value: string) => string> = {
      id: v => v,
      customerId: v => v,
      street: v => v,
      number: v => v,
      city: v => v,
      state: v => v,
      zipcode: v => (v || '')
        .replace(/\D/g, '') 
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
    }
    
    const formatter = formatters[name as keyof Address | keyof AddressDto]

    if(!formatter)
      return
    
    event.target.value = formatter(value)
  }  

  getAddressServiceErrorMessage = (errorType: AddressServiceErrors): string =>
    errorService.getServiceErrorMessage(addressServiceErrorMessages, errorType)
}
