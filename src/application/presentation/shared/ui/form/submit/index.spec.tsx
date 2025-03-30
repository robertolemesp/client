import { render } from '@testing-library/react'

import FormSubmit from '.'

jest.mock(
  '@/application/presentation/shared/ui/spinner',
  () => jest.fn(() => <div data-testid='spinner'>Spinner</div>)
)

describe('FormSubmit (Unit)', () => {
  it('renders the submit button with children text', () => {
    const { getByText } = render(<FormSubmit>Submit</FormSubmit>)
    expect(getByText('Submit')).toBeInTheDocument()
  })

  it('disables the button when isSubmitting is true', () => {
    const { getByRole } = render(<FormSubmit isSubmitting={true}>Submit</FormSubmit>)
    expect(getByRole('button')).toBeDisabled()
  })

  it('renders Spinner when isSubmitting is true', () => {
    const { getByTestId, queryByText } = render(<FormSubmit isSubmitting={true}>Submit</FormSubmit>)
    expect(getByTestId('spinner')).toBeInTheDocument()
    expect(queryByText('Submit')).not.toBeInTheDocument()
  })

  it('renders children when isSubmitting is false', () => {
    const { getByText, queryByTestId } = render(<FormSubmit isSubmitting={false}>Submit</FormSubmit>)
    expect(getByText('Submit')).toBeInTheDocument()
    expect(queryByTestId('spinner')).not.toBeInTheDocument()
  })
})
