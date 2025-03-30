import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RemoveIcon from '.'

describe('RemoveIcon (Unit)', () => {
  it('renders correctly', () => {
    render(<RemoveIcon onClick={() => {}} />)
    expect(screen.getByLabelText('Remove')).toBeInTheDocument()
  })

  it('displays the remove icon symbol', () => {
    render(<RemoveIcon onClick={() => {}} />)
    expect(screen.getByText('❌')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<RemoveIcon onClick={handleClick} />)

    await user.click(screen.getByLabelText('Remove'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has default class names', () => {
    const { container } = render(<RemoveIcon onClick={() => {}} />)
    expect(container.firstChild).toHaveClass('text-xl text-red-500 cursor-pointer')
  })
})
