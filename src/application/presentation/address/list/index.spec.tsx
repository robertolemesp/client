import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import type { AddressDto } from '@/application/dto/address'

import AddressList from '.'

const addressesMock: AddressDto[] = [
  {
    id: 1,
    customerId: 1,
    street: 'Av. Paulista',
    number: '1000',
    zipcode: '01310-100',
    city: 'São Paulo',
    state: 'SP'
  },
  {
    id: 2,
    customerId: 1,
    street: 'Rua das Flores',
    number: '200',
    zipcode: '04567-000',
    city: 'Curitiba',
    state: 'PR'
  }
]

describe('AddressList (Unit)', () => {
  it('renders without crashing with empty address list', () => {
    render(<AddressList />)
    expect(screen.queryByText(/Rua:/i)).not.toBeInTheDocument()
  })

  it('renders the list of addresses correctly', () => {
    render(<AddressList addresses={addressesMock} />)

    expect(screen.getByText(/Av. Paulista/i)).toBeInTheDocument()
    expect(screen.getByText(/Rua das Flores/i)).toBeInTheDocument()
    expect(screen.getAllByText(/CEP:/i)).toHaveLength(2)
    expect(screen.getAllByText(/Cidade:/i)).toHaveLength(2)
    expect(screen.getAllByText(/Estado:/i)).toHaveLength(2)
  })

})
