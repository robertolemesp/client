import { render, screen } from '@testing-library/react'
import { mergeClassNames } from '.'

const TestComponent = ({ isActive }: { isActive: boolean }) => (
  <div 
    data-testid='test-element' 
    className={
      mergeClassNames('text-sm', isActive && 'text-red-500', 'bg-blue-500')
    }
  >
    Test Content
  </div>
)

describe('mergeClassNames (Integration)', () => {
  it('applies merged class names correctly', () => {
    render(<TestComponent isActive={true} />)
  
    const element = screen.getByTestId('test-element')
  
    expect(element).toHaveClass('text-red-500')
    expect(element).toHaveClass('bg-blue-500')
    expect(element).toHaveClass('text-sm') //
  })

  it('does not apply conditional classes when false', () => {
    render(<TestComponent isActive={false} />)

    const element = screen.getByTestId('test-element')

    expect(element).not.toHaveClass('text-red-500')
    expect(element).toHaveClass('text-sm')
    expect(element).toHaveClass('bg-blue-500')
  })
})
