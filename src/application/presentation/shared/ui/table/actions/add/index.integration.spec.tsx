import { render, screen } from '@testing-library/react'

import AddIcon from '.'

describe('AddIcon (Integration)', () => {
  it('renders correctly', () => {
    render(<AddIcon />)
    expect(screen.getByLabelText('Adicionar Cliente')).toBeInTheDocument()
  })

  it('displays the plus symbol', () => {
    render(<AddIcon />)
    expect(screen.getByText('➕')).toBeInTheDocument()
  })

  it('has default class names', () => {
    const { container } = render(<AddIcon />)
    expect(container.firstChild).toHaveClass('text-sm text-black')
  })

  it('merges additional class names', () => {
    const { container } = render(<AddIcon className='custom-class' />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
