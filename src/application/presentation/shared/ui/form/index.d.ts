import type { SyntheticEvent, PropsWithChildren, RefObject } from 'react'

export type FormActionState = { success?: boolean, payload?: unknown }
export type FormActionStateHandler = (state: FormActionState, payload: FormData) => FormActionState | Promise<FormActionState>
export type FormActionResult = Promise<FormActionState>
export type FormAction = (state: FormActionState | null, formData: FormData) => FormActionState | Promise<FormActionState>

export interface BaseFormProps<T> extends PropsWithChildren { 
  className?: string
  ref?: RefObject<HTMLFormElement | null>
  action?: FormActionStateHandler
  onChange?: (event: FormEvent<HTMLFormElement>) => void
  onSubmit?: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>, action?: FormActionStateHandler) => void  
  isSubmitting?: boolean
  isSubmittingSpinnerColored?: boolean
  submitClassName?: string
  submitTitle?: string
  onActionStateChange?: (actionState: FormActionState) => void
  onFieldErrors?: (erroredFields: (keyof T)[]) => void
}
