import type { Customer } from '@/domain/customer/model'
import type { CustomerDto } from '.'

export type CustomerCreationDto = CustomerDto

export type CustomerCreationResultDto = 
  CustomerDto & Required<
    Pick<Customer, 'id'>
  >
