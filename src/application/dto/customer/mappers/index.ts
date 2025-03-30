import type { Customer } from '@/domain/customer/model'
import type { CustomerDto } from '@/application/dto/customer'

import { formatDateToBrazilianFormat } from '@/utils/date'

export const mapCustomerToDto = (customer: Customer): CustomerDto => ({
  ...customer,
  birthday: formatDateToBrazilianFormat(customer.birthday),
})
