import { render } from '@testing-library/react'

import Spinner from '.'

describe('Spinner', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders with the default variant and color', () => {
    const { container } = render(<Spinner />)
    const spinnerElement = container.firstChild as HTMLElement
    expect(spinnerElement).toHaveClass(
      'border-4',
      'rounded-full',
      'animate-spin',
      'w-12',
      'h-12',
      'border-primary-600',
      'border-t-black'
    )
  })

  it('applies a custom variant', () => {
    const { container } = render(<Spinner variant='large' />)
    const spinnerElement = container.firstChild as HTMLElement
    expect(spinnerElement).toHaveClass('w-16', 'h-16')
  })

  it('applies white border when colored is set to false', () => {
    const { container } = render(<Spinner colored={false} />)
    const spinnerElement = container.firstChild as HTMLElement
    expect(spinnerElement).toHaveClass('border-white', 'border-t-black')
  })

  it('merges a custom className', () => {
    const { container } = render(<Spinner className='my-custom-spinner' />)
    const spinnerElement = container.firstChild as HTMLElement
    expect(spinnerElement).toHaveClass('my-custom-spinner')
  })
})
