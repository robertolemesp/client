import type { Customer } from '@/domain/customer/model'

export type CustomerRemovalDto = Required<
  Pick<Customer, 'id'>
>
export type CustomerRemovalResultDto = void
