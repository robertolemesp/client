import { type JSX, useRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { parseFormData, updateFormElementsByRefAndFormData, hasFieldError } from '.'

const FormComponent = (): JSX.Element => {
  const formRef = useRef<HTMLFormElement | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    updateFormElementsByRefAndFormData(formRef, formData)
  }

  return <form ref={formRef} onSubmit={handleSubmit} role='form'>
    <input name='name' placeholder='Name' data-testid='name-input' />
    <input name='email' type='email' placeholder='Email' data-testid='email-input' />
    <button type='submit' data-testid='submit-button'>Submit</button>
  </form>
}

describe('Form Utils (Integration)', () => {
  it('parses form data correctly after user input', async () => {
    render(<FormComponent />)

    const nameInput = screen.getByTestId('name-input') as HTMLInputElement
    const emailInput = screen.getByTestId('email-input') as HTMLInputElement

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')

    const formData = new FormData()
    formData.append('name', nameInput.value)
    formData.append('email', emailInput.value)

    const parsedData = parseFormData<{ name: string; email: string }>(formData)

    expect(parsedData).toEqual({
      name: 'John Doe',
      email: 'john@example.com'
    })
  })

  it('updates form fields with FormData values', async () => {
    render(<FormComponent />)

    const formRef = { current: screen.getByRole('form') as HTMLFormElement }
    const formData = new FormData()
    formData.append('name', 'Roberto')
    formData.append('email', 'roberto@example.com')

    updateFormElementsByRefAndFormData(formRef, formData)

    expect(screen.getByTestId('name-input')).toHaveValue('Roberto')
    expect(screen.getByTestId('email-input')).toHaveValue('roberto@example.com')
  })

  it('correctly detects fields with errors', () => {
    const erroredFields = ['name', 'email']
    
    expect(hasFieldError('name', erroredFields)).toBe(true)
    expect(hasFieldError('email', erroredFields)).toBe(true)
    expect(hasFieldError('phone', erroredFields)).toBe(false)
  })
})
