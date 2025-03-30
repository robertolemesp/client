import { render } from '@testing-library/react'

import Spinner from '.'

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies default medium size class', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toHaveClass('w-12 h-12')
  })

  it('applies correct size class based on variant prop', () => {
    const { container } = render(<Spinner variant='large' />)
    expect(container.firstChild).toHaveClass('w-16 h-16')
  })

  it('applies default colored class', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toHaveClass('border-primary-600 border-t-black')
  })

  it('applies white border when colored is false', () => {
    const { container } = render(<Spinner colored={false} />)
    expect(container.firstChild).toHaveClass('border-white border-t-black')
  })

  it('has animation class', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toHaveClass('animate-spin')
  })
})
