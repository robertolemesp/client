import type { ErrorServiceInterface } from './types'
import {
   type SystemError, type DomainErrorOrigin, type ServiceErrorOrigin, type InfrastructureErrorOrigin, type MiscellaneousErrorOrigin,
   type DomainErrorPayload, type ServiceErrorPayload,type ValidationErrorPayload, type InfrastructureErrorPayload, type MiscellaneousErrorPayload, 
   type ValidationErrorType,
   validationErrorMessages,
} from '@/domain/error/model'
import { DomainErrorEntity, ServiceErrorEntity, InfrastructureErrorEntity, MiscellaneousErrorEntity } from '@/domain/error/entity'


export class ErrorService implements ErrorServiceInterface {
  generateDomainError <T> (origin: DomainErrorOrigin, payload: DomainErrorPayload, message?: string): DomainErrorEntity<T> {
    return new DomainErrorEntity(origin, payload, message)
  }

  generateServiceError <T>(
    origin: ServiceErrorOrigin | ServiceErrorOrigin[], payload: ServiceErrorPayload | ValidationErrorPayload<T>, message?: string
  ): ServiceErrorEntity<T> {
    return new ServiceErrorEntity<T>(origin, payload, message)
  }

  generateInfrastructureError <T>(
    origin: InfrastructureErrorOrigin | InfrastructureErrorOrigin[], payload: InfrastructureErrorPayload, message?: string
  ): InfrastructureErrorEntity<T> {
    return new InfrastructureErrorEntity<T>(origin, payload, message)
  }

  generateMiscellaneousError <T>(
    origin: MiscellaneousErrorOrigin | MiscellaneousErrorOrigin[], payload: MiscellaneousErrorPayload, message?: string
  ): ServiceErrorEntity<T> {
    return new MiscellaneousErrorEntity<T>(origin, payload, message)
  }

  getServiceErrorMessage<E extends Record<T, string>, T extends keyof E>(errorMessages: E, errorType: T): string {
    return errorMessages[errorType] || 'Unknown error occurred.'
  }

  getServiceValidationErrorMessage(errorType: ValidationErrorType): string {
    return validationErrorMessages[errorType] || 'Unknown error occurred.'
  }

  isSystemError <T>(error: unknown): error is SystemError<T> { 
    return typeof error === 'object' && error !== null &&
      'type' in error &&
      'origin' in error &&
      'payload' in error
  }
}

export const errorService = new ErrorService() // Singleton instead implementing a DI Container into the app
