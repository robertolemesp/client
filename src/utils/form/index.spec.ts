import { parseFormData, hasFieldError, updateFormElementsByRefAndFormData, prefixFormField, unprefixFormField, indexFormField, unindexFormField, hasFieldFromGroupError } from '.'
import { createRef } from 'react'

describe('form-utils (Unit)', () => {
  it('parses FormData into an object', () => {
    const formData = new FormData()
    formData.append('name', 'Roberto')
    formData.append('email', 'roberto@e-mail-provider.com')

    const parsed = parseFormData<{ name: string, email: string }>(formData)

    expect(parsed).toEqual({ name: 'Roberto', email: 'roberto@e-mail-provider.com' })
  })

  it('returns the original value if input is not FormData', () => {
    const invalidData = { key: 'value' }
    const parsed = parseFormData<typeof invalidData>(invalidData as unknown as FormData)

    expect(parsed).toEqual(invalidData)
  })

  it('checks if a field has an error', () => {
    const erroredFields = ['name', 'email']
    
    expect(hasFieldError('name', erroredFields)).toBe(true)
    expect(hasFieldError('email', erroredFields)).toBe(true)
    expect(hasFieldError('phone', erroredFields)).toBe(false)
  })

  it('updates form elements based on formData', () => {
    const formRef = createRef<HTMLFormElement>()

    document.body.innerHTML = `
      <form>
        <input name="name" />
        <input name="email" />
      </form>
    `
    formRef.current = document.querySelector('form')

    const formData = new FormData()
    formData.append('name', 'Roberto')
    formData.append('email', 'roberto@e-mail-provider.com')

    updateFormElementsByRefAndFormData(formRef, formData)

    expect((formRef.current!.elements.namedItem('name') as HTMLInputElement).value).toBe('Roberto')
    expect((formRef.current!.elements.namedItem('email') as HTMLInputElement).value).toBe('roberto@e-mail-provider.com')
  })

  it('prefixes form field names', () => {
    expect(prefixFormField('user', 'email')).toBe('user_email')
    expect(prefixFormField('address', 'zipcode')).toBe('address_zipcode')
  })

  it('unprefixes form field names', () => {
    expect(unprefixFormField('user', 'user_email')).toBe('email')
    expect(unprefixFormField('address', 'address_zipcode')).toBe('zipcode')
    expect(unprefixFormField('customer', 'email')).toBe('email')
  })

  it('indexes form field names', () => {
    expect(indexFormField(0, 'phone')).toBe('phone')
    expect(indexFormField(1, 'phone')).toBe('phone_2')
    expect(indexFormField(2, 'phone')).toBe('phone_3')
  })

  it('unindexes form field names', () => {
    expect(unindexFormField('phone')).toBe('phone')
    expect(unindexFormField('phone_2')).toBe('phone')
    expect(unindexFormField('address_5')).toBe('address')
  })

  it ('verifies a field from a error group has error (is in error list)', () => {
    const erroredFields = [
      { fieldName: 'a', otherProperty: 'x' },
      { fieldName: 'b', otherProperty: 'x' },
    ]
    
    expect(hasFieldFromGroupError('a', erroredFields)).toBe(true)
  })

  it("verifies a field from a error group has not error (isn't in error list)", () => { 
    const erroredFields = [
      { fieldName: 'a', otherProperty: 'x' },
      { fieldName: 'b', otherProperty: 'x' },
    ]
    
    expect(hasFieldFromGroupError('c', erroredFields)).toBe(false)
  })
})
