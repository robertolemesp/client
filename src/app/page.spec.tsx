import { type FC, HTMLAttributes } from 'react'
import { render } from '@testing-library/react'

import { redirect } from 'next/navigation'

import { authenticationSession } from '@/application/services/authentication/next-auth'

import MainPage from './page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

jest.mock('@/application/services/authentication/next-auth', () => ({
  authenticationSession: jest.fn()
}))

jest.mock('@/application/presentation/customer/table', () => {
  const CustomerTableMock: FC = () => <div data-testid='customer-table'>Customer Table</div>

  CustomerTableMock.displayName = 'CustomerTableMock'

  return CustomerTableMock
})

jest.mock('@/application/presentation/authentication/sign-out', () => {
  const SignOutMock: FC<HTMLAttributes<HTMLDivElement>> = props => <div data-testid='sign-out' {...props}>
    Sign Out
  </div>
  
  SignOutMock.displayName = 'SignOutMock'
  return SignOutMock
})

describe('MainPage', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to /sign-in if no authentication session', async () => {
    (authenticationSession as jest.Mock).mockResolvedValueOnce(null)
    try {
      await MainPage({})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}

    expect(redirect).toHaveBeenCalledWith('/sign-in')
  })

  it('renders the page when authentication session exists', async () => {
    (authenticationSession as jest.Mock).mockResolvedValueOnce({ user: { name: 'Test' } })
    const element = await MainPage({})
    const { getByRole, getByTestId } = render(element)
    expect(getByRole('heading', { name: /Painel Administrativo/i })).toBeInTheDocument()
    expect(getByTestId('sign-out')).toBeInTheDocument()
    expect(getByTestId('customer-table')).toBeInTheDocument()
  })
})
