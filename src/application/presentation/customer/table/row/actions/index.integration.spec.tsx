import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomerListTableRowActions from '.'

describe('CustomerListTableRowActions (Integration)', () => {
  it('renders correctly with EditIcon and RemoveIcon', () => {
    render(<CustomerListTableRowActions customerId={'1'} onEdit={() => {}} onRemove={() => {}} />)

    expect(screen.getByLabelText('Edit')).toBeInTheDocument()
    expect(screen.getByLabelText('Remove')).toBeInTheDocument()
  })

  it('calls onEdit when EditIcon is clicked', async () => {
    const user = userEvent.setup()
    const handleEdit = jest.fn()

    render(<CustomerListTableRowActions customerId={'1'} onEdit={handleEdit} onRemove={() => {}} />)

    await user.click(screen.getByLabelText('Edit'))
    expect(handleEdit).toHaveBeenCalledTimes(1)
    expect(handleEdit).toHaveBeenCalledWith('1')
  })

  it('calls onRemove when RemoveIcon is clicked', async () => {
    const user = userEvent.setup()
    const handleRemove = jest.fn()

    render(<CustomerListTableRowActions customerId={'1'} onEdit={() => {}} onRemove={handleRemove} />)

    await user.click(screen.getByLabelText('Remove'))
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleRemove).toHaveBeenCalledWith('1')
  })

  it('merges additional class names', () => {
    const { container } = render(
      <CustomerListTableRowActions customerId={'1'} onEdit={() => {}} onRemove={() => {}} className='custom-class' />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
