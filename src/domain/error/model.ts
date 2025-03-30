export type DomainErrorOrigin = 'Domain Authentication' | 'Domain Address' | 'Domain Customer' | 'Domain Error'

export type ServiceErrorOrigin = 'Service Authentication' | 'Service Address' | 'Service Customer' | 'Service Error'

export type InfrastructureErrorOrigin = 'Infrastructure Api' | 'Infrastructure Testing'

export type MiscellaneousErrorOrigin = 'Miscellaneous'

export type ErrorOriginType = DomainErrorOrigin | ServiceErrorOrigin | InfrastructureErrorOrigin | MiscellaneousErrorOrigin

export type ErrorOrigin = ErrorOriginType | ErrorOriginType[] | Array<ErrorOriginType | ErrorOriginType[]>

export type ErrorType = 'Domain' | 'Service' | 'Infrastructure' | 'Miscellaneous'

export type ErrorTitle = string

export enum ValidationErrorType {
  REQUIRED = 'REQUIRED',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  INVALID = 'INVALID',
  PATTERN_MISMATCH = 'PATTERN_MISMATCH'
}

export const validationErrorMessages: Record<ValidationErrorType, string> = {
  [ValidationErrorType.REQUIRED]: 'The field is required.',
  [ValidationErrorType.TOO_SHORT]: 'The field is too short.',
  [ValidationErrorType.TOO_LONG]: 'The field is too long.',
  [ValidationErrorType.INVALID]: 'The field is invalid.',
  [ValidationErrorType.PATTERN_MISMATCH]: 'The field does not match the required pattern.'
}

export type DomainErrorPayload = unknown 

export type ServiceErrorPayload = unknown

export type ValidationFieldError = keyof typeof validationErrorMessages  

export type InfrastructureErrorPayload = unknown

export type MiscellaneousErrorPayload = unknown

export interface ValidationError<T> { 
  fieldName: keyof T
  errors: ValidationFieldError[]
}

export interface GroupValidationError<T> { 
  fieldGroup: keyof T
  errors: ValidationError<T>[]
}

export type ValidationErrorPayload<T> = (ValidationError<T> | GroupValidationError<T>)[]

export type SystemErrorPayload<T> = DomainErrorPayload | ServiceErrorPayload | ValidationErrorPayload<T> | InfrastructureErrorPayload | MiscellaneousErrorPayload | Error

export interface SystemError<T> {
  type: ErrorType
  message: string
  payload: SystemErrorPayload<T>
}
