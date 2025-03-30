import { type RefObject } from 'react'

import { arrayHasSomeItemPropertyValue } from '@/utils/array'

export const parseFormData = <T extends Record<string, unknown>>(formData: FormData): T => 
  formData instanceof FormData ? Object.fromEntries(Array.from(formData.entries())) as T : formData

export const hasFieldError = <T> (fieldName: keyof T, erroredFields: (keyof T)[] = []) =>
  erroredFields.includes(fieldName)

export const hasFieldFromGroupError = <T> (fieldName: string, erroredFields: Record<keyof T, unknown>[]) => 
  arrayHasSomeItemPropertyValue(fieldName, erroredFields)

export const updateFormElementsByRefAndFormData = (formRef: RefObject<HTMLFormElement | null>, formData?: FormData): void => {
  if (!(formRef?.current && formData instanceof FormData))
    return

  const parsedFormData = parseFormData(formData)

  Object.entries(parsedFormData).forEach(([ key, value ]) => {
    const field = formRef.current!.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) 
      field.value = String(value)
  })
}

export const prefixFormField = (prefix: string, fieldName: string): string => `${prefix}_${String(fieldName)}`

export const unprefixFormField = (prefix: string, field: string):  string => {
  const match = field.match(new RegExp(`^${prefix}_(.+)$`))
  return match ? match[1] : field
}

export const indexFormField = (index: number, fieldName: string) => `${String(fieldName)}${index > 0 ? `_${index + 1}` : ''}` 

export const unindexFormField = (field: string): string => {
  const match = field.match(/^(.+?)(?:_\d+)?$/)
  return match ? match[1] : field
}
