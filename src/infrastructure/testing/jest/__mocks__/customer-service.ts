import type { ChangeEvent } from 'react'

import type { Customer } from '@/domain/customer/model'
import type { CustomerDto } from '@/application/dto/customer'
import type { CustomerServiceInterface } from '@/application/services/customer/types'
import type { CustomerCreationDto,  CustomerCreationResultDto} from '@/application/dto/customer/creation'
import type { CustomerUpdateDto, CustomerUpdateResultDto } from '@/application/dto/customer/update'
import type { CustomerRemovalDto, CustomerRemovalResultDto } from '@/application/dto/customer/removal'
import type { CustomerServiceErrors } from '@/application/services/customer/types'

export const customerServiceMock: CustomerServiceInterface = {
  createCustomer: jest.fn<Promise<CustomerCreationResultDto>, [CustomerCreationDto]>(),
  updateCustomer: jest.fn<Promise<CustomerUpdateResultDto>, [CustomerUpdateDto]>(),
  getCustomers: jest.fn<Promise<CustomerDto[]>, []>(),
  removeCustomer: jest.fn<Promise<CustomerRemovalResultDto>, [CustomerRemovalDto]>(),
  formatCustomerField: jest.fn<string, [keyof Customer | keyof CustomerDto, unknown]>(),
  maskCustomerFieldByName: jest.fn<void, [ChangeEvent<HTMLInputElement>]>(),
  getCustomerServiceErrorMessage: jest.fn<string, [CustomerServiceErrors]>()
}
