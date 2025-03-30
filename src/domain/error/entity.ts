import { type SystemError, type ValidationErrorPayload, type ErrorType, type ErrorOrigin, 
  InfrastructureErrorPayload, MiscellaneousErrorPayload, ServiceErrorPayload, SystemErrorPayload, 
  DomainErrorPayload
} from '@/domain/error/model'

export class ErrorEntity<T> extends Error implements SystemError<T> {
  public readonly type: ErrorType
  public readonly origin?: ErrorOrigin | ErrorOrigin[]
  public readonly payload: SystemErrorPayload<T>

  constructor(type: ErrorType, origin: ErrorOrigin | ErrorOrigin[], payload: SystemErrorPayload<T>, message?: string) {
    const name = `${
      origin 
      ? Array.isArray(origin) ? origin.join(' and ') : origin 
      : 'Unknown'
    } error`

    const _message = message || `${name} occurred`
      
    super(_message)

    this.validateEntity(type, origin, payload)

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.type = type
    this.origin = origin
    this.payload = payload
  }

  validateEntity(type: ErrorType, origin: ErrorOrigin | ErrorOrigin[], payload: SystemErrorPayload<T>): boolean {
    return !!type 
      && !!origin && Array.isArray(origin) ? origin.length > 0 : true
      && !!payload && typeof payload === 'object' ? Object.entries(payload).length > 0 : true
    }
}

export class DomainErrorEntity<T> extends ErrorEntity<T> {
  constructor(origin: ErrorOrigin, payload: DomainErrorPayload, message?: string) {
    super(
      'Domain',
      origin,
      payload,
      message
    )
  }
}

export class ServiceErrorEntity<T> extends ErrorEntity<T> {
  constructor(origin: ErrorOrigin, payload: ServiceErrorPayload | ValidationErrorPayload<T>, message?: string) {
    super(
      'Service', 
      origin,
      payload,
      message
    )
  }
}

export class InfrastructureErrorEntity<T> extends ErrorEntity<T> {
  constructor(origin: ErrorOrigin, payload: InfrastructureErrorPayload, message?: string) {
    super(
      'Infrastructure', 
      origin,
      payload,
      message
    )
  }
}

export class MiscellaneousErrorEntity<T> extends ErrorEntity<T> {
  constructor(origin: ErrorOrigin, payload: MiscellaneousErrorPayload, message?: string) {
    super(
      'Miscellaneous', 
      origin,
      payload,
      message
    )
  }
}

