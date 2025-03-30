import { type FC, type JSX, type ChangeEvent, useState } from 'react'

import type { AddressesDto, AddressDto } from '@/application/dto/address'
import type { ValidationErrorPayload } from '@/domain/error/model'
import { AddressCreationDto } from '@/application/dto/address/creation'
import { AddressUpdateDto } from '@/application/dto/address/update'

import { AddressService } from '@/application/services/address'

import { mergeClassNames } from '@/utils/classname'
import { prefixObjectPropertyValue, indexObjectPropertyValue, } from '@/utils/object'
import { hasFieldFromGroupError } from '@/utils/form'

import FormInput from '@/application/presentation/shared/ui/form/input'
import BaseButton from '@/application/presentation/shared/ui/button'

interface AddressFormFieldsProps {
  customerId?: number
  addresses?: AddressesDto
  hasNoAddressesAfterSubmit: boolean
  errorGroups?: Array<ValidationErrorPayload<AddressCreationDto | AddressUpdateDto>>
}

const AddressFormFields: FC<AddressFormFieldsProps> = ({ customerId, addresses = [], hasNoAddressesAfterSubmit, errorGroups = [] }): JSX.Element => {
  const FIELD_PREFIX = 'address_field'

   // Implemented to handle React DOM elements indexes mismatching in lists (classic index addressing issue)
  const addsTemporaryIdsToAddressesFields = (addresses: AddressesDto) =>
    addresses.map((address, index) => ({
      ...address,
      temporaryId: `address_${index + 1}`  
    }))

  const [ currentAddresses, setCurrentAddresses ] = useState(addsTemporaryIdsToAddressesFields(addresses))
  const [ nextAddressIndex, setNextAddressIndex ] = useState(addresses.length + 1)

  const createEmptyAddress = (): AddressDto & { temporaryId: string } => ({
    customerId,
    street: '',
    number: '',
    city: '',
    state: '',
    zipcode: '',
    temporaryId: `address_${nextAddressIndex}`
  })

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => 
    new AddressService().maskAddressFieldByName(event, FIELD_PREFIX, true)
  
  const handleAddAddressBtnClick = (): void => {
    setCurrentAddresses(currentAddresses => [
      ...currentAddresses,
      createEmptyAddress()
    ])

    setNextAddressIndex(index => index + 1)
  }

  const handleRemoveAddressButtonClick = (temporaryIdToRemove: string): void => {
    setCurrentAddresses(currentAddresses =>
      currentAddresses.filter(({ temporaryId }) => temporaryId !== temporaryIdToRemove)
    )
  }

  const getFieldName = (fieldName: keyof AddressDto, i: number): string => indexObjectPropertyValue(i, prefixObjectPropertyValue(FIELD_PREFIX, fieldName))

  return <div>
    { currentAddresses.map(({ temporaryId, id = '', number, street, zipcode, city, state }, i) => {
      const erroredFields = errorGroups[i] as unknown as Record<keyof AddressCreationDto | keyof AddressCreationDto, unknown>[]

      return <div key={temporaryId} className='flex flex-col gap-y-3 mt-5 text-white'>
        <h2 className='font-bold text-sm'>Endereço #{i + 1}</h2>
        <FormInput
          containerClassName='hidden'
          name={getFieldName('id', i)}
          hidden
          defaultValue={id}
        />
        <FormInput
          containerClassName='flex-1'
          name={getFieldName('zipcode', i)}
          placeholder='CEP'
          type='text'
          defaultValue={zipcode}
          onChange={handleFieldChange}
          error={hasFieldFromGroupError('zipcode', erroredFields)}
        />
        <div className='flex justify-between gap-3'>
          <FormInput
            containerClassName='flex-[2]'
            name={getFieldName('street', i)}
            placeholder='Rua'
            type='text'
            defaultValue={street}
            error={hasFieldFromGroupError('street', erroredFields)}
          />
          <FormInput
            containerClassName='flex-1'
            name={getFieldName('number', i)}
            placeholder='Nº (Cplmto?)'
            type='text'
            defaultValue={number}
            error={hasFieldFromGroupError('number', erroredFields)}
          />
        </div>
        <div className='flex justify-between gap-3'>
          <FormInput
            containerClassName='flex-1'
            name={getFieldName('city', i)}
            placeholder='Cidade'
            type='text'
            defaultValue={city}
            error={hasFieldFromGroupError('city', erroredFields)}
          />
          <FormInput
            containerClassName='flex-1'
            name={getFieldName('state', i)}
            placeholder='Estado'
            type='text'
            defaultValue={state}
            error={hasFieldFromGroupError('state', erroredFields)}
          />
        </div>
        <BaseButton
          onClick={() => handleRemoveAddressButtonClick(temporaryId)}
          className='remove-address-button w-full self-start h-10'
        >
          Remover endereço
        </BaseButton>
      </div>
    })}
    <BaseButton 
      className={
        mergeClassNames('add-address-button mt-8 px-4 self-start min-w-48', hasNoAddressesAfterSubmit && 'ring-2 ring-red-600 text-red-600')
      }
      onClick={handleAddAddressBtnClick}
    >
      <div>
        Adicionar Endereço 
        <span className='ml-1'>➕</span>
      </div>
    </BaseButton>
  </div>
}

export default AddressFormFields
