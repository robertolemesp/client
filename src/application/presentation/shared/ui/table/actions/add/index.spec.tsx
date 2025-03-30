import { render, screen } from '@testing-library/react'

import AddIcon from '.'

describe('AddIcon', () => {
  it('renders without crashing', () => {
    render(<AddIcon />)
    expect(screen.getByLabelText('Adicionar Cliente')).toBeInTheDocument()
  })

  it('contains the default text content', () => {
    render(<AddIcon />)
    expect(screen.getByText('➕')).toBeInTheDocument()
  })

  it('has the correct aria-label', () => {
    render(<AddIcon />)
    expect(screen.getByLabelText('Adicionar Cliente')).toBeInTheDocument()
  })

  it('applies default class names', () => {
    const { container } = render(<AddIcon />)
    expect(container.firstChild).toHaveClass('text-sm text-black')
  })

  it('merges additional class names', () => {
    const { container } = render(<AddIcon className='custom-class' />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
