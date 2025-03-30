import { render, screen } from '@testing-library/react'

import FormError from '.'

describe('FormError (Integration)', () => {
  it('renders correctly with error message', () => {
    render(<FormError>Required field</FormError>)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('applies default styling', () => {
    const { container } = render(<FormError>Required field</FormError>)
    expect(container.firstChild).toHaveClass('mt-2 text-red-600 dark:text-red-500')
  })
})
