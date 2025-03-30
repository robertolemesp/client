import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BaseButton from '.'

describe('BaseButton', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the button with given children', () => {
    const { getByText } = render(
      <BaseButton onClick={() => {}}>
        Test Button
      </BaseButton>
    )

    expect(getByText('Test Button')).toBeInTheDocument()
  })

  it('calls onClick when the button is clicked', async () => {
    const handleClick = jest.fn()
    const { getByText } = render(
      <BaseButton onClick={handleClick}>
        Click Me
      </BaseButton>
    )

    await userEvent.click(getByText('Click Me'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('merges provided className with default classNames', () => {
    const { getByRole } = render(
      <BaseButton onClick={() => {}} className='extra-class'>
        Custom Class
      </BaseButton>
    )

    const button = getByRole('button')
    expect(button).toHaveClass(
      'flex items-center justify-center w-32 h-12 font-bold rounded-lg text-sm text-center text-white bg-primary-600 focus:outline-none extra-class'
    )
  })
})
