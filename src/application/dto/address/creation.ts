
import type { Address } from '@/domain/address/model'
import type { AddressesDto } from '.'

export interface AddressCreationDto {
  addresses: AddressesDto
}

export type AddressCreationResultDto = Array<
  Address & Required<
    Pick<Address, 'id'>
  >
>
