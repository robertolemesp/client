import type { CustomerDto } from '.'
import type { AddressesDto } from '@/application/dto/address'

export type CustomerUpdateDto = Partial<CustomerDto> & Required<
  Pick<CustomerDto, 'id'>
>
export type CustomerUpdateResultDto = {
  addresses?: AddressesDto
}
