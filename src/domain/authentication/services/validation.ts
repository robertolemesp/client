import type { Authentication } from '@/domain/authentication/model'
import { AuthenticationEntity } from '@/domain/authentication/entity'
import type { AuthenticationDto, AuthenticationValidateCredentialsDto } from '@/application/dto/authentication'
import { 
  type DomainErrorOrigin, type ServiceErrorOrigin, type ValidationErrorPayload, type ValidationError, ValidationErrorType, type ValidationFieldError
} from '@/domain/error/model'

import { errorService } from '@/application/services/error'

interface AuthenticationValidation {
  validate(value?: unknown): void
}

export class RequiredValidator implements AuthenticationValidation {
  constructor() {}

  validate(value?: unknown) {
    if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0)) 
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.REQUIRED))
  }
}

export class TooShortValidator implements AuthenticationValidation {
  constructor(private minLength: number) {}

  validate(value: unknown) {
    if (typeof value === 'string' && value.length < this.minLength)
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.TOO_SHORT))
  }
}

export class TooLongValidator implements AuthenticationValidation {
  constructor(private maxLength: number) {}

  validate(value: unknown) {
    if (typeof value === 'string' && value.length > this.maxLength)
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.TOO_LONG))
  }
}

export class PatternMismatchValidator implements AuthenticationValidation {
  constructor(private pattern: RegExp) {}

  validate(value?: unknown) {
    if (typeof value === 'string' && !this.pattern.test(value)) 
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.PATTERN_MISMATCH))
  }
}

export class AuthenticationValidator {
  private static DOMAIN_ERROR_ORIGIN: DomainErrorOrigin = 'Domain Authentication'
  private static SERVICE_ERROR_ORIGIN: ServiceErrorOrigin = 'Service Authentication'
  private static PASSWORD_MIN_LENGTH = 8

  private static validate<T extends Record<keyof T, unknown>>(fieldName: keyof T, value: unknown, rules: AuthenticationValidation[] = []): ValidationError<T> | void  {
    const validationFieldErrors: ValidationFieldError[] = []

    for (const rule of rules) 
      try {
        rule.validate(value)
      }  catch (error) {
        validationFieldErrors.push((error as Error).message as ValidationFieldError)
      }

    if (validationFieldErrors.length)
      return { fieldName, errors: validationFieldErrors }
  }

  
  static commonValidationRules: Partial<Record<keyof Authentication, AuthenticationValidation[]>> = {
    email: [
      new RequiredValidator(),
      new PatternMismatchValidator(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/)
    ],
    password: [
      new RequiredValidator(),
      new TooShortValidator(this.PASSWORD_MIN_LENGTH)
      // It could be introduced more patterns for the password
    ]
  }

  static validateEntity(authenticationEntity: AuthenticationEntity) {
    const errorPayload: ValidationErrorPayload<AuthenticationEntity> = []

    const validationRules = this.commonValidationRules

    for (const field in validationRules) {
      const fieldName = field as keyof AuthenticationEntity
      const validationError = this.validate(fieldName, authenticationEntity[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<AuthenticationEntity>)
    }
      
    if (errorPayload.length > 0) 
      throw errorService.generateDomainError(this.DOMAIN_ERROR_ORIGIN, errorPayload)
  }
  
  static validateDto(authenticationDto: AuthenticationDto): void {
    const errorPayload: ValidationErrorPayload<AuthenticationDto> = []

    const validationRules = this.commonValidationRules

    for (const field in validationRules) {
      const fieldName = field as keyof AuthenticationDto
      const validationError = this.validate(fieldName, authenticationDto[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<AuthenticationDto>)
    }
      
    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }

  static validateCredentialsDto(authCredentialsDto: AuthenticationValidateCredentialsDto): void {
    const errorPayload: ValidationErrorPayload<AuthenticationValidateCredentialsDto> = []

    const validationRules = this.commonValidationRules
    
    for (const field in validationRules) {
      const fieldName = field as keyof AuthenticationValidateCredentialsDto
      const validationError = this.validate(fieldName, authCredentialsDto[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<AuthenticationValidateCredentialsDto>)
    }
      
    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }
}
