import { ErrorService } from '.'
import {
  type DomainErrorOrigin, type ServiceErrorOrigin, type InfrastructureErrorOrigin, type ErrorType, 
  ValidationErrorType, validationErrorMessages 
} from '@/domain/error/model'
import { DomainErrorEntity, ServiceErrorEntity, InfrastructureErrorEntity, MiscellaneousErrorEntity } from '@/domain/error/entity'

describe('ErrorService (Unit)', () => {
  let errorService: ErrorService

  const ERROR_CONSTANTS = {
    DOMAIN_ERROR_ORIGIN: 'Domain Error' as DomainErrorOrigin,
    SERVICE_ERROR_ORIGIN: 'Service Error' as ServiceErrorOrigin,
    ORIGIN: 'Infrastructure Testing' as InfrastructureErrorOrigin,
    TYPE: 'Infrastructure' as ErrorType,
    MESSAGE: 'A Test Error occurred.'
  }

  beforeEach(() => {
    errorService = new ErrorService()
  })

  it('generates a domain error entity with correct values', () => {
    const payload = [
      { fieldName: 'cpf', errors: [ValidationErrorType.INVALID] }
    ]

    const domainError = errorService.generateDomainError(ERROR_CONSTANTS.DOMAIN_ERROR_ORIGIN, payload)

    expect(domainError).toBeInstanceOf(DomainErrorEntity)
    expect(domainError.origin).toBe(ERROR_CONSTANTS.DOMAIN_ERROR_ORIGIN)
    expect(domainError.message).toBe(`${ERROR_CONSTANTS.DOMAIN_ERROR_ORIGIN} error occurred`)
    expect(domainError.payload).toEqual(payload)
    expect(domainError.type).toBe('Domain')
  })

  it('generates a service error entity with correct payload', () => {
    const payload = [
      { fieldName: 'email', errors: [ ValidationErrorType.REQUIRED, ValidationErrorType.INVALID ] }
    ]

    const serviceError = errorService.generateServiceError('Service Error', payload)

    expect(serviceError).toBeInstanceOf(ServiceErrorEntity)
    expect(serviceError.origin).toBe('Service Error')
    expect(serviceError.message).toBe(`${ERROR_CONSTANTS.SERVICE_ERROR_ORIGIN} error occurred`)
    expect(serviceError.payload).toEqual(payload)
  })


  it('returns validation service error messages from enum', () => {
    expect(
      errorService.getServiceValidationErrorMessage(ValidationErrorType.REQUIRED)
    ).toBe(validationErrorMessages.REQUIRED)

    expect(
      errorService.getServiceValidationErrorMessage(ValidationErrorType.INVALID)
    ).toBe(validationErrorMessages.INVALID)

    expect(
      errorService.getServiceValidationErrorMessage('UNKNOWN' as ValidationErrorType)
    ).toBe('Unknown error occurred.')
  })

  it('returns service error messages from a record', () => {
    const errorRecord = {
      ERROR_1: 'Error message 1',
      ERROR_2: 'Error message 2'
    }

    expect(errorService.getServiceErrorMessage(errorRecord, 'ERROR_1')).toBe('Error message 1')
    expect(errorService.getServiceErrorMessage(errorRecord, 'ERROR_2')).toBe('Error message 2')
    expect(errorService.getServiceErrorMessage(errorRecord, 'UNKNOWN' as keyof typeof errorRecord))
      .toBe('Unknown error occurred.')
  })

  it('generates an infrastructure error entity with correct properties', () => {
    const errorPayload = [
      { fieldName: 'api', errors: [ ValidationErrorType.INVALID ] }
    ]

    const error = errorService.generateInfrastructureError(ERROR_CONSTANTS.ORIGIN, errorPayload)

    expect(error).toBeInstanceOf(InfrastructureErrorEntity)
    expect(error.origin).toBe(ERROR_CONSTANTS.ORIGIN)
    expect(error.message).toBe(`${ERROR_CONSTANTS.ORIGIN} error occurred`)
    expect(error.payload).toEqual(errorPayload)
  })


  it('identifies system errors correctly', () => {
    const error = errorService.generateServiceError(ERROR_CONSTANTS.SERVICE_ERROR_ORIGIN, [])

    expect(errorService.isSystemError(error)).toBe(true)

    const notSystemError = { message: 'Some other error' }
    expect(errorService.isSystemError(notSystemError)).toBe(false)
  })

  it('generates a miscellaneous error entity correctly', () => {
    const origin = 'Miscellaneous'
    const payload = [
      { fieldName: 'a', errors: [ ValidationErrorType.INVALID ] }
    ]
  
    const error = errorService.generateMiscellaneousError(origin, payload)
  
    expect(error).toBeInstanceOf(MiscellaneousErrorEntity)
    expect(error.origin).toBe(origin)
    expect(error.payload).toEqual(payload)
    expect(error.message).toBe(`${origin} error occurred`)
    expect(error.type).toBe('Miscellaneous')
  })
})
