import { render } from '@testing-library/react'
import RootLayout, { metadata } from './layout'

describe('RootLayout', () => {
  it('exports metadata with the correct title', () => {
    expect(metadata.title).toBe('Roberto`s Mission')
  })

  it('renders children correctly', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid='child'>Hello, World!</div>
      </RootLayout>
    )
    const child = getByTestId('child')
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent('Hello, World!')
  })


  it("sets the lang attribute of the html element to 'pt'", () => {
    const { container } = render(
      <RootLayout>
        <div />
      </RootLayout>
    )
    
    const htmlElement = container.ownerDocument.documentElement
    expect(htmlElement).toHaveAttribute('lang', 'pt')
  })
})
