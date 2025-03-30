import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Modal from '.'

describe('Modal', () => {
  afterEach(() => jest.clearAllMocks() )

  it('displays the provided title', () => {
    const { getByText } = render(
      <Modal onClose={() => {}} title='Test Title'>
        <p>Test content</p>
      </Modal>
    )

    expect(getByText('Test Title')).toBeInTheDocument()
  })

  it('renders children content', () => {
    const { getByText } = render(
      <Modal onClose={() => {}}>
        <p>Modal Content</p>
      </Modal>
    )

    expect(getByText('Modal Content')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const handleClose = jest.fn()
    const { getByRole } = render(
      <Modal onClose={handleClose} title='Close Me'>
        <p>Some content</p>
      </Modal>
    )

    const button = getByRole('button')
    await userEvent.click(button)
    expect(handleClose).toHaveBeenCalled()
  })

  it('renders an open dialog', () => {
    const { container } = render(
      <Modal onClose={() => {}} title='Open Modal'>
        <p>Some content</p>
      </Modal>
    )

    const dialogElement = container.querySelector('dialog')
    expect(dialogElement).toBeInTheDocument()
    expect(dialogElement).toHaveAttribute('open')
  })
})
