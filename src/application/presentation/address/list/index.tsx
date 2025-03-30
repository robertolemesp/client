import { type FC, type JSX } from 'react'

import type { AddressDto } from '@/application/dto/address'
import { mergeClassNames } from '@/utils/classname'

interface AddressListProps {
  className?: string
  addresses?: AddressDto[]
}

const AddressList: FC<AddressListProps> = ({ className, addresses = [] }): JSX.Element => {
  
  const handleAddressClick = () => { 
    /* v2, Eg.: show location in a map or redirect to a external map service */ 
  }

  return <div className={
    mergeClassNames('address-list flex flex-col gap-y-6 text-white text-lg', className)
  }>
    { addresses.map(({ street, number, zipcode, city, state }, i) => 
      <div 
        key={i}
        className='address p-4 gap-y-4 ring-2 ring-primary-600 rounded-lg cursor-pointer hover:bg-primary-600'
        onClick={handleAddressClick}
      >
        <p className='flex gap-x-2'><label className='mr-auto'>Rua:</label> {street} -  Nº: {number}</p>
        <p className='flex gap-x-2'><label className='mr-auto'>CEP:</label> {zipcode}</p>
        <p className='flex gap-x-2'><label className='mr-auto'>Cidade:</label> {city}</p> 
        <p className='flex gap-x-2'><label className='mr-auto'>Estado:</label> {state}</p>
      </div>
    )}
  </div>
}

export default AddressList
