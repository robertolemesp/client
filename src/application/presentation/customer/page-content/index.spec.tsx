import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { CustomerTableProps } from '../table'

import CustomerPageContent from '.'

const mockedCustomers = [
  { id: 1, name: 'Roberto Padilha', addresses: [{ street: 'Rua A', number: '123', zipcode: '12345-678' }] },
  { id: 2, name: 'Roberto Padilha', addresses: [{ street: 'Rua B', number: '456', zipcode: '98765-432' }] }
]

jest.mock('@/application/services/customer', () => ({
  CustomerService: jest.fn().mockImplementation(() => ({
    getCustomers: jest.fn().mockResolvedValue(mockedCustomers),
    removeCustomer: jest.fn().mockResolvedValue(undefined),
  }))
}))

jest.mock('@/application/presentation/authentication/sign-out', () => jest.fn(() => <div data-testid='sign-out'>Sign Out</div>))

jest.mock('@/application/presentation/customer/table/toolbar', () => jest.fn(({ onAddCustomerButtonClick }) => 
  <button data-testid='add-customer' onClick={onAddCustomerButtonClick}>Add Customer</button>
))

jest.mock('@/application/presentation/customer/table', () => jest.fn(({ onEditCustomer, onRemoveCustomer, onCellClick, customers }: CustomerTableProps) => 
  <table>
    <tbody>
      {customers.map((customer, index) => 
        <tr key={index}>
          <td data-testid={`edit-${customer.id}`} onClick={() => onEditCustomer?.(customer.id)}>Edit</td>
          <td data-testid={`remove-${customer.id}`} onClick={() => onRemoveCustomer?.(customer.id)}>Remove</td>
          <td data-testid={`addresses-${customer.id}`} onClick={() => onCellClick?.(customer, 'addresses')}>Addresses</td>
        </tr>
      )}
    </tbody>
  </table>
))

jest.mock('@/application/presentation/shared/ui/modal', () => jest.fn(({ title, onClose, children }) => 
  <div data-testid='modal'>
    <h2>{title}</h2>
    <button data-testid='modal-close' onClick={onClose}>Close</button>
    {children}
  </div>
))

jest.mock('@/application/presentation/customer/form', () =>
  jest.fn(({ onFormActionStateChange }) => 
    <button
      data-testid="submit-form"
      onClick={() =>
        onFormActionStateChange({
          success: true,
          payload: { id: 3, name: 'New Customer', addresses: [] }
        })
      }
    >
      Submit
    </button>
  )
)

jest.mock('@/application/presentation/address/list', () => jest.fn(({ addresses }) => 
  <div data-testid='address-list'>{addresses?.length ? 'Addresses Exist' : 'No Addresses'}</div>
))

describe('CustomerPageContent (Unit)', () => {
  let customers: typeof mockedCustomers

  beforeEach(async () => {
    const { CustomerService } = await import('@/application/services/customer')

    customers = [...mockedCustomers]

    ;(CustomerService as jest.Mock).mockImplementation(() => ({
      getCustomers: jest.fn().mockImplementation(() => Promise.resolve(customers)),
      removeCustomer: jest.fn().mockImplementation(async (dto: { id: number }) => {
        customers = customers.filter(c => c.id !== dto.id)
      })
    }))
  })

  it('opens and closes address list modal', async () => {
    const { getByTestId, queryByText, findByTestId } = render(<CustomerPageContent />)

    await findByTestId('addresses-1')
    await userEvent.click(getByTestId('addresses-1'))

    expect(queryByText('Lista de Endereços')).toBeInTheDocument()

    await userEvent.click(getByTestId('modal-close'))
    await waitFor(() => expect(queryByText('Lista de Endereços')).not.toBeInTheDocument())
  })

  it('removes a customer', async () => {
    window.confirm = jest.fn(() => true)

    const { getByTestId, queryByTestId, findByTestId } = render(<CustomerPageContent />)

    await findByTestId('remove-1')
    await userEvent.click(getByTestId('remove-1'))

    await waitFor(() => expect(queryByTestId('remove-1')).not.toBeInTheDocument())
  })

  it('adds a customer with an address', async () => {
    const { getByTestId, queryByTestId } = render(<CustomerPageContent />)
  
    await userEvent.click(getByTestId('add-customer'))
    await userEvent.click(getByTestId('submit-form'))
  
    await waitFor(() => {
      expect(queryByTestId('edit-2')).toBeInTheDocument()
      expect(queryByTestId('remove-2')).toBeInTheDocument()
      expect(queryByTestId('addresses-2')).toBeInTheDocument()
    })
  
    await userEvent.click(getByTestId('addresses-2'))
  
    await waitFor(() => {
      expect(getByTestId('address-list')).toBeInTheDocument()
    })
  })
})
