import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomerListTableRowActions from '.'

jest.mock('@/application/presentation/shared/ui/table/actions/edit', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => <span data-testid='edit-icon' onClick={onClick}>✏️</span>
}))

jest.mock('@/application/presentation/shared/ui/table/actions/remove', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => <span data-testid='remove-icon' onClick={onClick}>❌</span>
}))

describe('CustomerListTableRowActions (Unit)', () => {
  it('renders correctly', () => {
    render(<CustomerListTableRowActions customerId={'1'} onEdit={() => {}} onRemove={() => {}} />)
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument()
    expect(screen.getByTestId('remove-icon')).toBeInTheDocument()
  })

  it('calls onEdit when EditIcon is clicked', async () => {
    const user = userEvent.setup()
    const handleEdit = jest.fn()

    render(<CustomerListTableRowActions customerId={'1'} onEdit={handleEdit} onRemove={() => {}} />)

    await user.click(screen.getByTestId('edit-icon'))
    expect(handleEdit).toHaveBeenCalledTimes(1)
    expect(handleEdit).toHaveBeenCalledWith('1')
  })

  it('calls onRemove when RemoveIcon is clicked', async () => {
    const user = userEvent.setup()
    const handleRemove = jest.fn()

    render(<CustomerListTableRowActions customerId={'1'} onEdit={() => {}} onRemove={handleRemove} />)

    await user.click(screen.getByTestId('remove-icon'))
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleRemove).toHaveBeenCalledWith('1')
  })

  it('merges additional class names', () => {
    const { container } = render(<CustomerListTableRowActions customerId={'1'} onEdit={() => {}} onRemove={() => {}} className='custom-class' />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
