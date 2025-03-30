import type { Customer } from '@/domain/customer/model'
import type { AddressesDto } from '@/application/dto/address'

export interface CustomerDto extends Customer {
  addresses?: AddressesDto
}
