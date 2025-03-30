import type { FC, JSX } from 'react'

import type { CustomerUpdateDto } from '@/application/dto/customer/update'

import { CustomerService } from '@/application/services/customer'
import { hasFieldError } from '@/utils/form'

import FormInput from '@/application/presentation/shared/ui/form/input'

interface UpdateCustomerFormFields {
  customer: CustomerUpdateDto
  erroredFields?: (keyof CustomerUpdateDto)[]
}

const UpdateCustomerFormFields: FC<UpdateCustomerFormFields> = ({ customer: { id, name, email, birthday, rg, cpf, phone }, erroredFields }): JSX.Element => {
  const handleFieldChange = new CustomerService().maskCustomerFieldByName 

  return <>
    <FormInput containerClassName='hidden' name='id'  type='text' defaultValue={id} />
    <FormInput containerClassName='hidden' name='email'  type='text' defaultValue={email} />
    <FormInput containerClassName='flex-1'
      name='name' placeholder='Coloque o nome' type='text'
      defaultValue={name}
      error={hasFieldError('name', erroredFields)}
    />
    <FormInput 
      containerClassName='flex-1'
      name='birthday' 
      placeholder='Data de nascimento' 
      type='text'
      defaultValue={birthday}
      onChange={handleFieldChange}
      error={hasFieldError('birthday', erroredFields)}
    />
    <div className='flex justify-between gap-3'>
      <FormInput containerClassName='flex-1'
        name='rg' placeholder='Coloque o RG' type='text'
        defaultValue={rg}
        onChange={handleFieldChange}
        error={hasFieldError('rg', erroredFields)}
      />
      <FormInput containerClassName='flex-1'
        name='cpf' placeholder='Coloque o CPF' type='text'
        defaultValue={cpf}
        onChange={handleFieldChange}
        error={hasFieldError('cpf', erroredFields)}
      />
    </div>
    <FormInput containerClassName='flex-1'
      name='phone' placeholder='Coloque o telefone' type='text'
      defaultValue={phone}
      error={hasFieldError('phone', erroredFields)}
      onChange={handleFieldChange}
    />
  </>
}

export default UpdateCustomerFormFields
