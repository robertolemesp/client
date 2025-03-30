import type { FC, JSX } from 'react'

import type { CustomerCreationDto } from '@/application/dto/customer/creation'

import { CustomerService } from '@/application/services/customer'

import { hasFieldError } from '@/utils/form'

import FormInput from '@/application/presentation/shared/ui/form/input'

interface CreateCustomerFormFieldsProps {
  erroredFields?: (keyof CustomerCreationDto)[]
}

const CreateCustomerFormFields: FC<CreateCustomerFormFieldsProps> = ({ erroredFields }): JSX.Element => {
  const handleFieldChange = new CustomerService().maskCustomerFieldByName

  return <>
    <FormInput 
      containerClassName='flex-1'
      name='name' 
      placeholder='Coloque o nome' 
      type='text'
      error={hasFieldError('name', erroredFields)}
    />
    <div className='flex justify-between gap-3'>
      <FormInput 
        containerClassName='flex-1'
        name='email' 
        placeholder='Coloque o e-mail' 
        type='text'
        error={hasFieldError('email', erroredFields)}
      />
      <FormInput 
        containerClassName='flex-1'
        name='birthday' 
        placeholder='Data de nascimento' 
        type='text'
        onChange={handleFieldChange}
        error={hasFieldError('birthday', erroredFields)}
      />
    </div>
    <div className='flex justify-between gap-3'>
      <FormInput 
        containerClassName='flex-1'
        name='rg' 
        placeholder='RG' 
        type='text'
        onChange={handleFieldChange}
        error={hasFieldError('rg', erroredFields)}
      />
      <FormInput 
        containerClassName='flex-1'
        name='cpf' 
        placeholder='CPF' 
        type='text'
        onChange={handleFieldChange}
        error={hasFieldError('cpf', erroredFields)}
      />
    </div>
    <FormInput 
      containerClassName='flex-1'
      name='phone' 
      placeholder='Telefone' 
      type='text'
      onChange={handleFieldChange}
      error={hasFieldError('phone', erroredFields)}
    />
  </>
}

export default CreateCustomerFormFields
