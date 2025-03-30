import type { Customer } from '@/domain/customer/model'
import type { CustomerUpdateDto } from '@/application/dto/customer/update'

import { AddressService } from '@/application/services/address'

import { formatDateToBrazilianFormat, formatDateToISO8601 } from '@/utils/date'

export const mapCustomerDtoToUpdateDto = (customer: Customer): CustomerUpdateDto => ({
  ...customer,
  id: customer.id!,
  birthday: formatDateToBrazilianFormat(customer.birthday),
})

export const mapParsedFormDataToCustomerUpdateDto = (parsedFormData: Record<string, unknown>): CustomerUpdateDto => {
  const id = Number(parsedFormData.id)
  const { name, email, birthday, cpf, rg, phone } = parsedFormData 
  
  return {
    id: id,
    name: name as string,
    email: email as string,
    birthday: formatDateToISO8601(birthday as string),
    cpf: cpf as string,
    rg: rg as string,
    phone: phone as string,
    addresses: new AddressService().extractAddressesFromParsedFormData(parsedFormData, id)
  }
}
