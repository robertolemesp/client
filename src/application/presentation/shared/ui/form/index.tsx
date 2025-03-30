'use client'
import type { BaseFormProps, FormActionState, FormActionStateHandler } from './index.d'
import { type JSX, type SyntheticEvent, useActionState, useEffect } from 'react'
import NextForm from 'next/form'

import FormSubmit from './submit'

export const defaultAction: FormActionStateHandler = async (_: FormActionState, formData: FormData) => {
  const entries = Object.fromEntries(formData.entries())
  return { success: true, payload: entries }
}

export type FormProps<T> = BaseFormProps<T>

const Form = <T,>(
  { className, ref, action = defaultAction, onChange, onSubmit, isSubmitting, submitClassName, submitTitle, onActionStateChange, children }: FormProps<T>
): JSX.Element => {
  const [ formActionState, formAction, isPending ] = useActionState<FormActionState, FormData>(action, {})

  const hasAction = action.toString() !== '()=>{}'

  const handleFormAction = hasAction ? formAction : () => {}

  const handleFormChange = onChange

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => onSubmit?.(event, action)

  useEffect(() => {
    if (onActionStateChange) 
      onActionStateChange(formActionState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formActionState])

  return <NextForm 
    ref={ref}
    className={className}
    action={handleFormAction} 
    onChange={handleFormChange}
    onSubmit={handleFormSubmit}
  >
    { children }
    <FormSubmit className={submitClassName} isSubmitting={isPending || isSubmitting}>
      { submitTitle || 'Submit' }
    </FormSubmit>
  </NextForm>
}

export default Form
