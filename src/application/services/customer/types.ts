import type { ChangeEvent } from 'react'

import type { Customer } from '@/domain/customer/model'
import type { CustomerDto } from '@/application/dto/customer'
import type { CustomerCreationDto, CustomerCreationResultDto } from '@/application/dto/customer/creation'
import type { CustomerRemovalDto, CustomerRemovalResultDto } from '@/application/dto/customer/removal'
import type { CustomerUpdateDto, CustomerUpdateResultDto } from '@/application/dto/customer/update'

export interface CustomerServiceInterface {
  createCustomer(customerCreationDto: CustomerCreationDto): Promise<CustomerCreationResultDto>
  updateCustomer(customerUpdateDto: CustomerUpdateDto): Promise<CustomerUpdateResultDto>
  getCustomers(): Promise<CustomerDto[] | void>
  removeCustomer(customerRemovalDto: CustomerRemovalDto): Promise<CustomerRemovalResultDto>
  formatCustomerField(fieldName: keyof Customer | keyof CustomerDto, value: unknown): string 
  maskCustomerFieldByName(event: ChangeEvent<HTMLInputElement>): void
  getCustomerServiceErrorMessage(errorType: CustomerServiceErrors): string
}

export enum CustomerServiceErrors {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  RETRIEVE_ALL = 'RETRIEVE',
  REMOVE = 'REMOVE',
}

export const customerServiceErrorMessages: Record<CustomerServiceErrors, string> = {
  [CustomerServiceErrors.CREATE]: `Failed to create Customer.`,
  [CustomerServiceErrors.UPDATE]: `Failed to update Customer.`,
  [CustomerServiceErrors.RETRIEVE_ALL]: `Failed to retrieve Customers.`,
  [CustomerServiceErrors.REMOVE]: `Failed to remove Customer.`
}
