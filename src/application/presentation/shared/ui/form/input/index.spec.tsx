import { render, screen } from '@testing-library/react'

import FormInput from '.'

describe('FormInput (Unit)', () => {
  it('renders correctly', () => {
    render(<FormInput />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies default styling', () => {
    const { container } = render(<FormInput />)
    expect(container.firstChild).toHaveClass('flex')
  })

  it('applies error styling when error exists', () => {
    const { container } = render(<FormInput error />)
    expect(container.querySelector('input')).toHaveClass('border-red-600 placeholder-red-600 focus:ring-red-600 focus:border-red-600')
  })

  it('applies default input styles', () => {
    const { container } = render(<FormInput />)
    expect(container.querySelector('input')).toHaveClass('border-gray-300 placeholder-gray-700 focus:border-primary-600 focus:ring-primary-600')
  })

  it('merges additional class names', () => {
    const { container } = render(<FormInput className='custom-class' />)
    expect(container.querySelector('input')).toHaveClass('custom-class')
  })

  it('renders children elements inside the container', () => {
    render(
      <FormInput>
        <span data-testid='child-element'>Child</span>
      </FormInput>
    )
    expect(screen.getByTestId('child-element')).toBeInTheDocument()
  })
})
