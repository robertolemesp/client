import type { ChangeEvent } from 'react'

import type { AddressesDto } from '@/application/dto/address'

import type { AddressCreationDto, AddressCreationResultDto } from '@/application/dto/address/creation'
import type { AddressUpdateDto, AddressUpdateResultDto } from '@/application/dto/address/update'
import type { AddressRemovalDto, AddressRemovalResultDto } from '@/application/dto/address/removal'

export interface AddressServiceInterface {
  createAddress(addressCreationDto: AddressCreationDto): Promise<AddressCreationResultDto>
  updateAddress(addressUpdateDto: AddressUpdateDto): Promise<AddressUpdateResultDto>
  removeAddress(removAddressesDto: AddressRemovalDto): Promise<AddressRemovalResultDto>
  
  extractAddressesFromParsedFormData<T>(parsedFormData: Record<keyof T, unknown>, customerId?: number): AddressesDto
  maskAddressFieldByName(event: ChangeEvent<HTMLInputElement>): void  

  getAddressServiceErrorMessage(errorType: AddressServiceErrors): string
}

export enum AddressServiceErrors {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE'
}

export const addressServiceErrorMessages: Record<AddressServiceErrors, string> = {
  [AddressServiceErrors.CREATE]: 'Failed to Create Address',
  [AddressServiceErrors.UPDATE]: 'Failed to Update Address',
  [AddressServiceErrors.REMOVE]: 'Failed to Remove Address'
}
