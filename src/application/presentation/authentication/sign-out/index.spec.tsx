import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SignOut from '.'

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(() => Promise.resolve())
}))

import { signOut } from 'next-auth/react'

describe('SignOut (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the sign out button with text', () => {
    render(<SignOut />)
    expect(screen.getByRole('button')).toHaveTextContent('Sair ➜')
  })

  it('calls signOut on click with redirect path', async () => {
    const user = userEvent.setup()
    render(<SignOut />)

    await user.click(screen.getByRole('button'))

    expect(signOut).toHaveBeenCalledWith({ redirectTo: '/sign-in' })
  })

  it('shows spinner while loading', async () => {
    const user = userEvent.setup()
    render(<SignOut />)
  
    await user.click(screen.getByRole('button'))
  
    expect(await screen.findByRole('status')).toBeInTheDocument()
  
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Sair ➜')
    }, { timeout: 2000 })
  })
})
