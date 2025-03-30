import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FormInput from '.'

describe('FormInput (Integration)', () => {
  it('renders correctly with default styles', () => {
    render(<FormInput />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-gray-300 placeholder-gray-700 focus:border-primary-600 focus:ring-primary-600')
  })

  it('updates input value on user input', async () => {
    const user = userEvent.setup()
    render(<FormInput />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Test input')
    
    expect(input).toHaveValue('Test input')
  })

  it('applies error styling when error prop is set', () => {
    render(<FormInput error />)
    expect(screen.getByRole('textbox')).toHaveClass('border-red-600 placeholder-red-600 focus:ring-red-600 focus:border-red-600')
  })

  it('merges additional class names', () => {
    const { container } = render(<FormInput className='custom-class' />)
    expect(container.querySelector('input')).toHaveClass('custom-class')
  })

  it('renders children inside the container', () => {
    render(
      <FormInput>
        <span data-testid='child-element'>Child</span>
      </FormInput>
    )
    expect(screen.getByTestId('child-element')).toBeInTheDocument()
  })
})
