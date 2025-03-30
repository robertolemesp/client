import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BaseButton from '.'

describe('BaseButton', () => {
  it('renders with children', () => {
    render(<BaseButton onClick={() => {}}>Click Me</BaseButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<BaseButton onClick={handleClick}>Click Me</BaseButton>)
    
    await user.click(screen.getByRole('button', { name: /click me/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has default class names', () => {
    const { container } = render(<BaseButton onClick={() => {}}>Click Me</BaseButton>)
    expect(container.firstChild).toHaveClass(
      'flex items-center justify-center w-32 h-12 font-bold rounded-lg text-sm text-center text-white bg-primary-600 focus:outline-none'
    )
  })

  it('merges additional class names', () => {
    const { container } = render(<BaseButton onClick={() => {}} className='custom-class'>Click Me</BaseButton>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('supports additional button attributes', () => {
    render(<BaseButton onClick={() => {}} disabled>Click Me</BaseButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled()
  })
})
