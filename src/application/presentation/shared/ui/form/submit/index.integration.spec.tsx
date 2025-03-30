import { type FormEvent, useState } from 'react'

import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FormSubmit from '.'

const MockForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 1000)
  }

  return <form onSubmit={handleSubmit}>
    <FormSubmit isSubmitting={isSubmitting}>Submit</FormSubmit>
  </form>
}

describe('FormSubmit (Integration)', () => {
  it('submits form when clicked (not disabled)', async () => {
    const { getByText } = render(<MockForm />)
    const button = getByText('Submit')

    await userEvent.click(button)
    expect(button).toBeDisabled()
  })

  it('shows the spinner after submission', async () => {
    const { getByText, container } = render(<MockForm />)
    const button = getByText('Submit')

    await userEvent.click(button)

    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
