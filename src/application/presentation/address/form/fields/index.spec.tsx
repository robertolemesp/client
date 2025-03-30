import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AddressFormFields from '.'

jest.mock('@/application/services/address', () => ({
  AddressService: jest.fn().mockImplementation(() => ({
    maskAddressFieldByName: jest.fn()
  }))
}))

describe('AddressFormFields (Unit)', () => {
  const baseProps = {
    customerId: 1,
    addresses: [
      {
        street: 'Rua A',
        number: '10',
        zipcode: '12345-678',
        city: 'Cidade A',
        state: 'AA',
        customerId: 1
      }
    ],
    hasNoAddressesAfterSubmit: false,
    errorGroups: []
  }

  it('renders initial address fields', () => {
    render(<AddressFormFields {...baseProps} />)
    expect(screen.getByPlaceholderText('Rua')).toHaveValue('Rua A')
    expect(screen.getByPlaceholderText('Nº (Cplmto?)')).toHaveValue('10')
    expect(screen.getByPlaceholderText('CEP')).toHaveValue('12345-678')
  })

  it('adds a new address when button is clicked', async () => {
    const user = userEvent.setup()
    render(<AddressFormFields {...baseProps} />)
    await user.click(screen.getByRole('button', { name: /adicionar endereço/i }))

    const streetInputs = screen.getAllByPlaceholderText('Rua')
    expect(streetInputs.length).toBe(2)
  })

  it('removes an address when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<AddressFormFields {...baseProps} />)

    await user.click(screen.getByRole('button', { name: /remover endereço/i }))

    const ruaInputs = screen.queryAllByPlaceholderText('Rua')
    expect(ruaInputs.length).toBe(0)
  })

  it('displays red border when hasNoAddressesAfterSubmit is true', () => {
    render(<AddressFormFields {...baseProps} hasNoAddressesAfterSubmit={true} />)
    const button = screen.getByRole('button', { name: /adicionar endereço/i })
    expect(button).toHaveClass('ring-2', 'ring-red-600', 'text-red-600')
  })
})
