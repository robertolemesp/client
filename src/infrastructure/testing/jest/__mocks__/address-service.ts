import type { ChangeEvent } from 'react'
import type { AddressesDto } from '@/application/dto/address'
import type { AddressServiceErrors, AddressServiceInterface } from '@/application/services/address/types'
import type { AddressCreationDto, AddressCreationResultDto } from '@/application/dto/address/creation'
import type { AddressUpdateDto, AddressUpdateResultDto } from '@/application/dto/address/update'
import type { AddressRemovalDto, AddressRemovalResultDto } from '@/application/dto/address/removal'

export const addressServiceMock: AddressServiceInterface = {
  createAddress: jest.fn<Promise<AddressCreationResultDto>, [AddressCreationDto]>(),
  updateAddress: jest.fn<Promise<AddressUpdateResultDto>, [AddressUpdateDto]>(),
  removeAddress: jest.fn<Promise<AddressRemovalResultDto>, [AddressRemovalDto]>(),
  
  extractAddressesFromParsedFormData: jest.fn<AddressesDto, [Record<string, unknown>, number?]>(),
  maskAddressFieldByName:  jest.fn<void, [ChangeEvent<HTMLInputElement>]>(),
  getAddressServiceErrorMessage: jest.fn<string, [AddressServiceErrors]>()
}
