import type { Customer } from '@/domain/customer/model'
import { CustomerEntity } from '@/domain/customer/entity'
import type { CustomerDto } from '@/application/dto/customer'
import type { CustomerCreationDto } from '@/application/dto/customer/creation'
import type { CustomerUpdateDto } from '@/application/dto/customer/update'
import type { CustomerRemovalDto } from '@/application/dto/customer/removal'
import { 
  type ServiceErrorOrigin, type ValidationErrorPayload, type ValidationError, type ValidationFieldError, DomainErrorOrigin, ValidationErrorType 
} from '@/domain/error/model'

import { errorService } from '@/application/services/error'

interface CustomerValidation {
  validate(value?: unknown): void
}

export class RequiredValidator implements CustomerValidation {
  constructor() {}

  validate(value?: unknown) {
    if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0))
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.REQUIRED))
  }
}

export class TooShortValidator implements CustomerValidation {
  constructor(private minLength: number) {}

  validate(value?: unknown) {
    if (typeof value === 'string' && value.length < this.minLength)
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.TOO_SHORT))
  }
}

export class PatternMismatchValidator implements CustomerValidation {
  constructor(private pattern: RegExp) {}

  validate(value?: unknown) {
    if (typeof value === 'string' && !this.pattern.test(value))
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.PATTERN_MISMATCH))
  }
}

export class CustomerValidator {
  private static DOMAIN_ERROR_ORIGIN: DomainErrorOrigin = 'Domain Customer'
  private static SERVICE_ERROR_ORIGIN: ServiceErrorOrigin = 'Service Customer'
  
  private static COMMON_MIN_LENGTH = 3

  constructor() {}

  private static validate<T extends Record<keyof T, unknown>>(fieldName: keyof T, value: unknown, rules: CustomerValidation[] = []): ValidationError<T> | void {
    const validationFieldErrors: ValidationFieldError[] = []

    for (const rule of rules)
      try {
        rule.validate(value)
      } catch (error) {
        validationFieldErrors.push((error as Error).message as ValidationFieldError)
      }

    if (validationFieldErrors.length)
      return { fieldName, errors: validationFieldErrors }
  }

  static commonValidationRules: Partial<Record<keyof Customer | keyof CustomerDto, CustomerValidation[]>> = {
    name: [
      new RequiredValidator(),
      new TooShortValidator(this.COMMON_MIN_LENGTH)
    ],
    email: [
      new RequiredValidator(),
      new PatternMismatchValidator(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/)
    ],
    birthday: [
      new RequiredValidator()
    ],
    cpf: [
      new RequiredValidator(),
      new PatternMismatchValidator(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    ],
    rg: [
      new RequiredValidator(),
      new PatternMismatchValidator(/^\d{2}\.\d{3}\.\d{3}-[0-9X]$/)
    ],
    phone: [
      new RequiredValidator(),
      new PatternMismatchValidator(/^\([1-9]{2}\)\s?9\d{4}-\d{4}$/)
    ],
    addresses: [new RequiredValidator()]
  }
  
  static validateEntity(customerEntity: CustomerEntity) {
    const errorPayload: ValidationErrorPayload<CustomerEntity> = []

    const validationRules = this.commonValidationRules

    for (const field in validationRules) {
      const fieldName = field as keyof CustomerEntity
      const validationError = this.validate(fieldName, customerEntity[fieldName], validationRules[fieldName])

      if (validationError) errorPayload.push(validationError as ValidationError<CustomerEntity>)
    }

    if (errorPayload.length > 0) 
      throw errorService.generateDomainError(this.DOMAIN_ERROR_ORIGIN, errorPayload)
  }

  static validateDto(customerDto: CustomerDto): void {
    const errorPayload: ValidationErrorPayload<CustomerDto> = []

    const validationRules = this.commonValidationRules

    for (const field in validationRules) {
      const fieldName = field as keyof CustomerDto
      const validationError = this.validate(fieldName, customerDto[fieldName], validationRules[fieldName])

      if (validationError) 
        errorPayload.push(validationError as ValidationError<Partial<CustomerDto>>)
    }

    if (errorPayload.length > 0) 
      throw errorPayload
  }

  static validateCreationDto(customerCreationDto: CustomerCreationDto): void {
    const errorPayload: ValidationErrorPayload<CustomerCreationDto> = []

    const validationRules = this.commonValidationRules

    for (const field in validationRules) {
      const fieldName = field as keyof CustomerCreationDto
      const validationError = this.validate(fieldName, customerCreationDto[fieldName], validationRules[fieldName])

      if (validationError) 
        errorPayload.push(validationError as ValidationError<CustomerCreationDto>)
    }

    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }

  static validateUpdateDto(customerUpdateDto: CustomerUpdateDto): void {
    const errorPayload: ValidationErrorPayload<CustomerUpdateDto> = []

    const validationRules = this.commonValidationRules

    delete validationRules.email

    for (const field in validationRules) {
      const fieldName = field as keyof CustomerUpdateDto
      const validationError = this.validate(fieldName, customerUpdateDto[fieldName], validationRules[fieldName])

      if (validationError) 
        errorPayload.push(validationError as ValidationError<CustomerUpdateDto>)
    }

    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }

  static validateRemovalDto(customerRemovalDto: CustomerRemovalDto): void {
    const errorPayload: ValidationErrorPayload<CustomerRemovalDto> = []

    const validationRules: Partial<Record<keyof CustomerRemovalDto, CustomerValidation[]>> = {
      id: [
        new RequiredValidator()
      ]
    }

    for (const field in validationRules) {
      const fieldName = field as keyof CustomerRemovalDto
      const validationError = this.validate(fieldName, customerRemovalDto[fieldName], validationRules[fieldName])

      if (validationError) 
        errorPayload.push(validationError as ValidationError<CustomerRemovalDto>)
    }

    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }
}
