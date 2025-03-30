import type { AddressesDto } from '.'

export interface AddressUpdateDto {
  customerId: number
  addresses: AddressesDto
}

export type AddressUpdateResultDto = {
  addresses: AddressesDto
}
