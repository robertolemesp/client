import type { 
  DomainErrorPayload, ErrorOrigin, InfrastructureErrorPayload, MiscellaneousErrorPayload, 
  ServiceErrorPayload, SystemErrorPayload, ValidationErrorPayload, ValidationErrorType 
} from '@/domain/error/model'

import { DomainErrorEntity, ServiceErrorEntity, InfrastructureErrorEntity, MiscellaneousErrorEntity } from '@/domain/error/entity'

export interface ErrorServiceInterface {
  generateDomainError<T>(origin: ErrorOrigin, payload: DomainErrorPayload): DomainErrorEntity<T>
  generateServiceError<T>(origin: ErrorOrigin, payload: ServiceErrorPayload | ValidationErrorPayload<T>): ServiceErrorEntity<T>
  generateInfrastructureError<T>(origin: ErrorOrigin, payload: InfrastructureErrorPayload): InfrastructureErrorEntity<T>
  generateMiscellaneousError<T>(origin: ErrorOrigin, payload: MiscellaneousErrorPayload): MiscellaneousErrorEntity<T> 

  getServiceErrorMessage<E extends Record<T, string>, T extends keyof E>(errorRecord: E, errorType: T): string
  getServiceValidationErrorMessage(errorType: ValidationErrorType): string 
  
  isSystemError<T>(error: unknown): error is SystemErrorPayload<T>
}
