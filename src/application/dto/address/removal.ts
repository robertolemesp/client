import type { AddressDto } from '.'

export type AddressesRemovalDto = Required<
  Pick<AddressDto, 'id'>
>[]

export interface AddressRemovalDto {
  customerId: number
  addressIds: number[]
}

export type AddressRemovalResultDto = void
