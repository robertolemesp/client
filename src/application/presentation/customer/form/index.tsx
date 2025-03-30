'use client'
import { type FC, type JSX, type ReactNode, type SyntheticEvent, useRef, useState } from 'react'

import type { CustomerDto } from '@/application/dto/customer'
import type { CustomerCreationDto } from '@/application/dto/customer/creation'
import type { CustomerUpdateDto } from '@/application//dto/customer/update'
import type { AddressesDto } from '@/application/dto/address'
import type { AddressCreationDto } from '@/application/dto/address/creation'
import type { AddressUpdateDto } from '@/application/dto/address/update'
import type { FormActionState } from '@/application/presentation/shared/ui/form/index.d'
import { ValidationErrorPayload, type GroupValidationError, type ValidationError } from '@/domain/error/model'

import { customerCreateFormSubmitAction, customerUpdateFormSubmitAction } from '@/application/services/customer/actions'
import { AddressService } from '@/application/services/address'
import { mapCustomerDtoToUpdateDto } from '@/application/dto/customer/mappers/update'

import { mergeClassNames } from '@/utils/classname'
import { mapArrayItemPropertiesValuesByKey } from '@/utils/array'
import { parseFormData, updateFormElementsByRefAndFormData } from '@/utils/form'

import Form from '@/application/presentation/shared/ui/form'
import CreateCustomerFormFields from '@/application/presentation/customer/form/fields/create'
import UpdateCustomerFormFields from '@/application/presentation/customer/form/fields/update'
import AddressFormFields from '@/application/presentation/address/form/fields'


interface CustomerFormProps {
  className?: string
  customer?: CustomerDto | null
  mode: 'creation' | 'edition' | null
  onFormActionStateChange?: (actionState: FormActionState) => void
}

type FormDataTypes = CustomerCreationDto | CustomerUpdateDto | AddressCreationDto | AddressUpdateDto 

const CustomerForm: FC<CustomerFormProps> = ({ className, customer, mode, onFormActionStateChange }): JSX.Element => {
  const addressSevice = new AddressService()
  const ref = useRef<HTMLFormElement | null>(null)

  const [ formData, setFormData ] = useState<FormData>()
  const [ formActionState, setFormActionState ] = useState<FormActionState>({})
  const [ currentAddresses, setCurrentAddresses ] = useState<AddressesDto>(customer?.addresses || [])

  const action = mode === 'creation' ? customerCreateFormSubmitAction : customerUpdateFormSubmitAction

  const getSubmitTitle = (): string => mode === 'creation' ? 'Criar' : 'Salvar'

  const getCustomerErroredFields = () => mapArrayItemPropertiesValuesByKey(
    'fieldName', 
    (formActionState.payload as Record<string, unknown>[] || [])
  ) as Array<keyof CustomerDto>
     
  const getAddressErrorGroups = (): Array<ValidationErrorPayload<AddressCreationDto | AddressUpdateDto>> => {
    const errorPayload = formActionState.payload as GroupValidationError<FormDataTypes>[]
    
    return (Array.isArray(errorPayload) ?  errorPayload : [])
      .filter(groupValidationItem => groupValidationItem.fieldGroup === 'addresses')
      .map(
        groupValidationItem => groupValidationItem.errors
      ) 
    }

  const Fields: FC = (): ReactNode => 
      mode === 'creation' ? <CreateCustomerFormFields erroredFields={getCustomerErroredFields()} /> 
    : 
      customer ? 
        <UpdateCustomerFormFields customer={mapCustomerDtoToUpdateDto(customer)} erroredFields={getCustomerErroredFields()} />
      : 
        null   

  const handleFormActionStateChange = (actionState: FormActionState) => {
    if (!formData)
      return

    if (actionState.success === false) { 
      setCurrentAddresses(
        addressSevice.extractAddressesFromParsedFormData(parseFormData(formData))
      )
      setTimeout(() => updateFormElementsByRefAndFormData(ref, formData), 1)
    }

    setFormActionState(actionState)
    onFormActionStateChange?.(actionState)
  }

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => setFormData(new FormData(event.currentTarget))

  const hasNoAddressesAfterSubmit: boolean = (formActionState.payload as ValidationError<FormDataTypes>[] || [])
    .some?.(item => item.fieldName === 'addresses')
    
  return <Form<CustomerCreationDto | CustomerUpdateDto>
    className={
      mergeClassNames(`flex flex-col justify-center w-full gap-y-6 p-6 overflow-auto`, className)
    }
    ref={ref}
    action={action}
    onActionStateChange={handleFormActionStateChange}
    submitClassName='customer-form-submit mx-auto min-h-12 w-full uppercase'
    submitTitle={getSubmitTitle()}
    onSubmit={handleFormSubmit}
  >
    <Fields />
    <AddressFormFields
      customerId={customer?.id}
      addresses={currentAddresses}
      hasNoAddressesAfterSubmit={hasNoAddressesAfterSubmit}
      errorGroups={getAddressErrorGroups()}
    />
  </Form>
}

export default CustomerForm
