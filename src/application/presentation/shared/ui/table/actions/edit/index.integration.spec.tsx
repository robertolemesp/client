import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import EditIcon from '.'

describe('EditIcon (Integration)', () => {
  it('renders correctly', () => {
    render(<EditIcon onClick={() => {}} />)
    expect(screen.getByLabelText('Edit')).toBeInTheDocument()
  })

  it('displays the edit icon symbol', () => {
    render(<EditIcon onClick={() => {}} />)
    expect(screen.getByText('✏️')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<EditIcon onClick={handleClick} />)

    await user.click(screen.getByLabelText('Edit'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has default class names', () => {
    const { container } = render(<EditIcon onClick={() => {}} />)
    expect(container.firstChild).toHaveClass('text-xl text-black mr-2 cursor-pointer')
  })
})
