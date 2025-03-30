
import type { FormActionResult } from '@/application/presentation/shared/ui/form/index.d'

import { CustomerService } from '@/application/services/customer'

import { ServiceErrorEntity } from '@/domain/error/entity'

import { parseFormData } from '@/utils/form'
import { mapParsedFormDataToCustomerCreationDto } from '@/application/dto/customer/mappers/creation'
import { mapParsedFormDataToCustomerUpdateDto } from '@/application/dto/customer/mappers/update'

export const customerCreateFormSubmitAction = async (_: unknown, payload: FormData): FormActionResult => {
  const customerService = new CustomerService()

  const parsedFormData = parseFormData(payload)
    
  const customerCreationDto = mapParsedFormDataToCustomerCreationDto(parsedFormData)
 
  try {
    return { success: true, payload: await customerService.createCustomer(customerCreationDto) }
  } catch (error) {
    return { success: false, payload: error instanceof ServiceErrorEntity ? error.payload : error }
  }
}

export const customerUpdateFormSubmitAction = async (_: unknown, payload: FormData): FormActionResult => {
  const customerService = new CustomerService()
  
  const parsedFormData = parseFormData(payload)
  
  const customerUpdateDto = mapParsedFormDataToCustomerUpdateDto(parsedFormData)
  
  try {
    return { success: true, payload: await customerService.updateCustomer(customerUpdateDto) }
  } catch (error) {
    return { success: false, payload: error instanceof ServiceErrorEntity ? error.payload : error }
  }
}
