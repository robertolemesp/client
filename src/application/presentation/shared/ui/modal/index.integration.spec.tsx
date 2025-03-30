import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Modal from '.'

describe('Modal (Integration)', () => {
  it('renders correctly with title and children', () => {
    render(
      <Modal onClose={() => {}} title='Test Modal'>
        <p>Modal content</p>
      </Modal>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()

    render(
      <Modal onClose={handleClose} title='Test Modal'>
        <p>Modal content</p>
      </Modal>
    )

    await user.click(screen.getByRole('button', { name: /×/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
