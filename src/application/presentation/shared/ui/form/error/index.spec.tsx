import { render, screen } from '@testing-library/react'

import FormError from '.'

describe('FormError (Unit)', () => {
  it('renders correctly', () => {
    render(<FormError>Test error message</FormError>)
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('applies default styling', () => {
    const { container } = render(<FormError>Test error message</FormError>)
    expect(container.firstChild).toHaveClass('mt-2 text-red-600 dark:text-red-500')
  })
})
