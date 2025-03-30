// we are  coupling validators to mocks and then spreading it to it's consumers because the rules logic are same among the validators
// but it should follow changes on its implementations
import { ValidationErrorType } from '@/domain/error/model'

import { errorService } from '@/application/services/error'

export const requiredValidatorMock = {
  validate: jest.fn((value?: unknown) => {
    if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0))
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.REQUIRED))
  })
}

export const tooShortValidatorMock = {
  validate: jest.fn((value?: unknown) => {
    if (typeof value === 'string' && value.length < 3)
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.TOO_SHORT))
  })
}

export const patternMismatchValidatorMock = {
  validate: jest.fn((value?: unknown) => {
    if (typeof value === 'string' && !/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value))
      throw new Error(errorService.getServiceValidationErrorMessage(ValidationErrorType.PATTERN_MISMATCH))
  })
}
