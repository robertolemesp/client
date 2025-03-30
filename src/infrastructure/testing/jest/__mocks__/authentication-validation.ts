import { patternMismatchValidatorMock, requiredValidatorMock, tooShortValidatorMock } from './validations'

export const authenticationValidationMock = {
  commonValidationRules: {
    email: [ requiredValidatorMock, patternMismatchValidatorMock ],
    password: [ requiredValidatorMock, tooShortValidatorMock ]
  },
  validateEntity: jest.fn(),
  validateDto: jest.fn(),
  validateCredentialsDto: jest.fn()
}
