import { render, screen } from '@testing-library/react'
import type { CustomerDto } from '@/application/dto/customer'

import { formatDateToBrazilianFormat, formatDateToISO8601 } from '.'

describe('formatDateToBrazilianFormat (Integration) - UI', () => {
  const CustomerMock = ({ customer }: { customer: CustomerDto }) => {
    return <div>
      <h2>{ customer.name }</h2>
      <p>Email: { customer.email }</p>
      <p>Birthday: { formatDateToBrazilianFormat(customer.birthday) }</p>
    </div>
  }

  it('renders customer details with formatted birthday', () => {
    const customerDtoMock: CustomerDto = {
      id: 1,
      name: 'Roberto',
      birthday: '1995-01-11',
      email: 'roberto@email.com',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      phone: '(12) 3456-7890'
    }

    render(<CustomerMock customer={customerDtoMock} />)

    expect(screen.getByText('Roberto')).toBeInTheDocument()
    expect(screen.getByText('Email: roberto@email.com')).toBeInTheDocument()
    expect(screen.getByText('Birthday: 11/01/1995')).toBeInTheDocument()
  })

  it('renders empty birthday field gracefully when not provided', () => {
    const mockCustomer: CustomerDto = {
      id: 2,
      name: 'Ana',
      birthday: '',
      email: 'ana@email.com',
      cpf: '321.654.987-00',
      rg: '98.765.432-1',
      phone: '(21) 9876-5432'
    }

    render(<CustomerMock customer={mockCustomer} />)

    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Email: ana@email.com')).toBeInTheDocument()
    expect(screen.getByText('Birthday:')).toBeInTheDocument()
  })

  it('converts a Brazilian date to ISO format before using in payload', () => {
    const birthdayInput = '11/01/1995'
    const expected = '1995-01-11'

    const converted = formatDateToISO8601(birthdayInput)

    expect(converted).toBe(expected)
  })
})

describe('formatDateToISO8601 (Integration) - UI', () => {
  const CustomerMock = ({ birthday }: { birthday: string }) => {
    const isoDate = formatDateToISO8601(birthday)

    const customerDtoMock: CustomerDto = {
      id: 1,
      name: 'Roberto',
      birthday: isoDate,
      email: 'roberto@email.com',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      phone: '(12) 3456-7890'
    }

    return <div>
      <h2>{ customerDtoMock.name }</h2>
      <p>Email: { customerDtoMock.email }</p>
      <p>Birthday: { customerDtoMock.birthday }</p>
    </div>
  }

  it('converts a Brazilian date to ISO format before rendering', () => {
    render(<CustomerMock birthday="11/01/1995" />)

    expect(screen.getByText('Roberto')).toBeInTheDocument()
    expect(screen.getByText('Email: roberto@email.com')).toBeInTheDocument()
    expect(screen.getByText('Birthday: 1995-01-11')).toBeInTheDocument()
  })
})
