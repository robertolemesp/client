import type { CustomerCreationDto } from '@/application/dto/customer/creation'

import { AddressService } from '@/application/services/address'

import { formatDateToISO8601 } from '@/utils/date'

export const mapParsedFormDataToCustomerCreationDto = (parsedFormData: Record<string, unknown>): CustomerCreationDto => {
  const addressService = new AddressService()

  const { name, email, birthday, cpf, rg, phone } = parsedFormData 

  return {
    name: name as string,
    email: email as string,
    birthday: formatDateToISO8601(birthday as string),
    rg: rg as string,
    cpf: cpf as string, 
    phone: phone as string,
    addresses: addressService.extractAddressesFromParsedFormData(parsedFormData)
  }
}
