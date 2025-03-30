import type { AddressCreationDto } from '@/application/dto/address/creation'
import type { AddressUpdateDto } from '@/application/dto/address/update'
import type { AddressRemovalDto } from '@/application/dto/address/removal'

import { AddressService } from '.'
import { addressValidationMock } from '@/infrastructure/testing/jest/__mocks__/address-validation'
import { addressServiceErrorMessages, AddressServiceErrors } from './types'
import { ChangeEvent } from 'react'


describe('Address Service (Unit)', () => {
  let addressService: AddressService

  const addressPayload = {
    customerId: 1,
    street: 'Rua Teste',
    number: '123',
    zipcode: '12345-678',
    city: 'São Paulo',
    state: 'SP'
  } 

  const addressesMock = [
    { id: 1, ...addressPayload },
    { id: 2, ...addressPayload, street: 'Rua Teste 2', zipcode: '54321-000' }
  ] 

  beforeEach(() => {
    jest.clearAllMocks()
    addressService = new AddressService()
  })

  it('creates addresses successfully', async () => {
    jest.spyOn(addressService, 'createAddress').mockResolvedValue(addressesMock)

    const payload: AddressCreationDto = {
      addresses: [addressPayload]
    }

    const result = await addressService.createAddress(payload)

    expect(result).toEqual(addressesMock)
    expect(addressService.createAddress).toHaveBeenCalledWith(payload)
  })

  it('fails to create addresses due to validation error', async () => {
    const errorMessage = 'Invalid address fields'

    jest.spyOn(addressValidationMock, 'validateCreationDto').mockImplementation(() => {
      throw new Error(errorMessage)
    })
    jest.spyOn(addressService, 'createAddress').mockImplementation(async () => {
      throw new Error(errorMessage)
    })

    const payload: AddressCreationDto = {
      addresses: []
    }

    await expect(addressService.createAddress(payload)).rejects.toThrow(errorMessage)
  })

  it('updates addresses successfully', async () => {
    jest.spyOn(addressService, 'updateAddress').mockResolvedValue({ addresses: addressesMock })

    const payload: AddressUpdateDto = {
      customerId: 1,
      addresses: [addressesMock[0]]
    }

    const result = await addressService.updateAddress(payload)

    expect(result).toEqual({ addresses: addressesMock })
    expect(addressService.updateAddress).toHaveBeenCalledWith(payload)
  })

  it('fails to update addresses due to validation error', async () => {
    const errorMessage = 'Address update failed'

    jest.spyOn(addressValidationMock, 'validateUpdateDto').mockImplementation(() => {
      throw new Error(errorMessage)
    })
    jest.spyOn(addressService, 'updateAddress').mockImplementation(async () => {
      throw new Error(errorMessage)
    })

    const payload: AddressUpdateDto = {
      customerId: 1,
      addresses: []
    }

    await expect(addressService.updateAddress(payload)).rejects.toThrow(errorMessage)
  })

  it('removes addresses successfully', async () => {
    jest.spyOn(addressService, 'removeAddress').mockResolvedValue()

    const payload: AddressRemovalDto = {
      customerId: 1,
      addressIds: [1, 2]
    }

    await addressService.removeAddress(payload)
    expect(addressService.removeAddress).toHaveBeenCalledWith(payload)
  })

  it('fails to remove addresses due to validation error', async () => {
    const errorMessage = 'Address ID required'

    jest.spyOn(addressValidationMock, 'validateRemovalDto').mockImplementation(() => {
      throw new Error(errorMessage)
    })
    jest.spyOn(addressService, 'removeAddress').mockImplementation(async () => {
      throw new Error(errorMessage)
    })

    const payload: AddressRemovalDto = {
      customerId: 1,
      addressIds: []
    }

    await expect(addressService.removeAddress(payload)).rejects.toThrow(errorMessage)
  })

  it('masks zipcode field correctly', () => {
    const event = {
      target: {
        name: 'zipcode',
        value: '12345678'
      }
    } as unknown as ChangeEvent<HTMLInputElement>

    addressService.maskAddressFieldByName(event)

    expect(event.target.value).toBe('12345-678')
  })

  it('gets address service error message for a known type', () => {
    const message = addressService.getAddressServiceErrorMessage(AddressServiceErrors.CREATE)

    expect(message).toBe(addressServiceErrorMessages[AddressServiceErrors.CREATE])
  })
})
