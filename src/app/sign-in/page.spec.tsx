import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { redirect } from 'next/navigation'
import { authenticationSession } from '@/application/services/authentication/next-auth'

import SignInPage from './page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

jest.mock('@/application/services/authentication/next-auth', () => ({
  authenticationSession: jest.fn()
}))

jest.mock('@/application/presentation/authentication/credentials-sign-in-form', () => ({
  __esModule: true,
  default: () => <div data-testid='credentials-sign-in-form'>Credentials SignIn Form</div>
}))

jest.mock('@/application/presentation/authentication/o-auth-sign-in-form', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div data-testid='oauth-sign-in-form' className={className}>
      OAuth SignIn Form
    </div>
  )
}))

describe('SignInPage (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to "/" if user is authenticated', async () => {
    ;(authenticationSession as jest.Mock).mockResolvedValue({ user: { email: 'mock@email.com' } })

    await SignInPage({})

    expect(authenticationSession).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('renders credentials and oauth forms if not authenticated', async () => {
    ;(authenticationSession as jest.Mock).mockResolvedValue(null)

    const Page = await SignInPage({})
    const { getByTestId } = render(Page)

    expect(getByTestId('credentials-sign-in-form')).toBeInTheDocument()
    expect(getByTestId('oauth-sign-in-form')).toBeInTheDocument()
  })
})
