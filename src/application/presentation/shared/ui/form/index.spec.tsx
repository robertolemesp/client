import type { SyntheticEvent } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Form, { type FormProps } from '.'

jest.mock('next/form', () => {
  return {
    __esModule: true,
    default: <T,>({ onSubmit, className, children }: FormProps<T>) => {
      const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        if (onSubmit) 
          onSubmit(e)
      }

      return <form className={className} onSubmit={handleSubmit}>
        { children }
      </form>
    }
  }
})

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    useActionState: () => [ { success: false }, jest.fn(), false ]
  }
})

describe('Form (Unit)', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders default submit text', () => {
    const { getByText } = render(<Form />)

    expect(getByText('Submit')).toBeInTheDocument()
  })

  it('calls onSubmit when the form is submitted', async () => {
    const onSubmit = jest.fn()
    const { getByText } = render(<Form onSubmit={onSubmit} />)

    await userEvent.click(getByText('Submit'))

    expect(onSubmit).toHaveBeenCalled()
  })
})
