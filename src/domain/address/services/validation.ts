import type { Address } from '@/domain/address/model'
import { AddressEntity } from '@/domain/address/entity'
import { ServiceErrorEntity } from '@/domain/error/entity'
import type { AddressDto } from '@/application/dto/address'
import type { AddressCreationDto } from '@/application/dto/address/creation'
import type { AddressUpdateDto } from '@/application/dto/address/update'
import type { AddressRemovalDto } from '@/application/dto/address/removal'
import {
  type DomainErrorOrigin, type ServiceErrorOrigin, type ValidationErrorPayload, type ValidationError,  type ValidationFieldError, ValidationErrorType 
} from '@/domain/error/model'

import { errorService } from '@/application/services/error'

interface AddressValidation {
  validate(value?: unknown): void
}

export class RequiredValidator implements AddressValidation {
  constructor() {}

  validate(value?: unknown) {
    if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0))
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.REQUIRED))
  }
}

export class TooShortValidator implements AddressValidation {
  constructor(private minLength: number) {}

  validate(value: unknown) {
    if (typeof value === 'string' && value.length < this.minLength) 
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.TOO_SHORT))
  }
}

export class PatternMismatchValidator implements AddressValidation {
  constructor(private pattern: RegExp) {}

  validate(value?: unknown) {
    if (typeof value === 'string' && !this.pattern.test(value)) 
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.PATTERN_MISMATCH))
  }
}

export class AddressValidator {
  private static DOMAIN_ERROR_ORIGIN: DomainErrorOrigin = 'Domain Authentication'
  private static SERVICE_ERROR_ORIGIN: ServiceErrorOrigin = 'Service Authentication'

  private static validate<T extends Record<keyof T, unknown>>(fieldName: keyof T, value: unknown, rules: AddressValidation[] = []): ValidationError<T> | void {
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

  private static commonValidationRules: Partial<Record<keyof Address, AddressValidation[]>> = {
    street: [
      new RequiredValidator(),
      new TooShortValidator(5)
    ],
    number: [
      new RequiredValidator()
    ],
    zipcode: [
      new RequiredValidator(),
      new PatternMismatchValidator(/^\d{5}-\d{3}$/)
    ],
    city: [
      new RequiredValidator(),
      new TooShortValidator(3)
    ],
    state: [
      new RequiredValidator(),
      new TooShortValidator(2)
    ]
  }

  static validateEntity(addressEntity: AddressEntity): void {
    const errorPayload: ValidationErrorPayload<AddressEntity> = []

    const validationRules = this.commonValidationRules

    for (const field in validationRules) {
      const fieldName = field as keyof AddressEntity
      const validationError = this.validate(fieldName, addressEntity[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<AddressEntity>)
    }

    if (errorPayload.length > 0) 
      throw errorService.generateDomainError(this.DOMAIN_ERROR_ORIGIN, errorPayload)
  }

  static validateDto(addressDto: AddressDto): void {
    const errorPayload: ValidationErrorPayload<AddressDto> = []

    const validationRules = this.commonValidationRules

    for (const field in validationRules) {
      const fieldName = field as keyof AddressDto
      const validationError = this.validate(fieldName, addressDto[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<Partial<Address>>)
    }

    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }

  static validateCreationDto(addressCreationDto: AddressCreationDto): ValidationErrorPayload<AddressCreationDto> | void {
    const errorPayload: ValidationErrorPayload<AddressCreationDto> = []
    
    const validationRules: Partial<Record<keyof AddressCreationDto, AddressValidation[]>> = {
      addresses: [ 
        new RequiredValidator() 
      ]
    }
    
    for (const field in validationRules) {
      const fieldName = field as keyof AddressCreationDto
      const validationError = this.validate(fieldName, addressCreationDto[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<AddressCreationDto>)
    }
    
    addressCreationDto.addresses.forEach(address => {
      try {
        this.validateDto(address)
      } catch (error) {
        if (error instanceof ServiceErrorEntity) 
          errorPayload.push({ fieldGroup: 'addresses', errors: error.payload as ValidationError<AddressCreationDto>[] })
      }
    })
    
    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }
  
  static validateUpdateDto(addressUpdateDto: AddressUpdateDto): void {
    const errorPayload: ValidationErrorPayload<AddressUpdateDto> = []

    const validationRules: Partial<Record<keyof AddressUpdateDto, AddressValidation[]>> = {
      customerId: [ 
        new RequiredValidator() 
      ],
      addresses: [ 
        new RequiredValidator() 
      ]
    }
    
    for (const field in validationRules) {
      const fieldName = field as keyof AddressUpdateDto
      const validationError = this.validate(fieldName, addressUpdateDto[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<AddressUpdateDto>)
    }

    addressUpdateDto.addresses.forEach(address => {
      try {
        this.validateDto(address)
      } catch (error) {
        if (error instanceof ServiceErrorEntity)           
          errorPayload.push({ fieldGroup: 'addresses', errors: error.payload as ValidationError<AddressCreationDto>[] })
      }
    })
    
    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }

  static validateRemovalDto(addressRemovalDto: AddressRemovalDto): ValidationErrorPayload<AddressRemovalDto> | void {
    const errorPayload: ValidationErrorPayload<AddressRemovalDto> = []

    const validationRules: Partial<Record<keyof AddressRemovalDto, AddressValidation[]>> = {
      customerId: [ 
        new RequiredValidator() 
      ],
      addressIds: [ 
        new RequiredValidator() 
      ]
    }
    
    for (const field in validationRules) {
      const fieldName = field as keyof AddressRemovalDto
      const validationError = this.validate(fieldName, addressRemovalDto[fieldName], validationRules[fieldName])

      if (validationError)
        errorPayload.push(validationError as ValidationError<AddressRemovalDto>)
    }


    const addressIdsValidationRules: Partial<Record<string, AddressValidation[]>> = {
      id: [ 
        new RequiredValidator() 
      ]
    }

    addressRemovalDto.addressIds.forEach(id => {
      for (const field in addressIdsValidationRules) {
        const fieldName = field
        const validationError = this.validate(fieldName, id, addressIdsValidationRules[fieldName])
  
        if (validationError)
          errorPayload.push(validationError as ValidationError<unknown>)
      }
    })

    if (errorPayload.length > 0) 
      throw errorService.generateServiceError(this.SERVICE_ERROR_ORIGIN, errorPayload)
  }
}
