import { patternMismatchValidatorMock, requiredValidatorMock, tooShortValidatorMock } from './validations'

export const addressValidationMock = {
  commonValidationRules: {
    street: [ requiredValidatorMock, tooShortValidatorMock ],
    number: [ requiredValidatorMock ],
    zipcode: [ requiredValidatorMock, patternMismatchValidatorMock ],
    city: [ requiredValidatorMock, tooShortValidatorMock ],
    state: [ requiredValidatorMock, tooShortValidatorMock ]
  },
  validateEntity: jest.fn(),
  validateDto: jest.fn(),
  validateCreationDto: jest.fn(),
  validateUpdateDto: jest.fn(),
  validateRemovalDto: jest.fn()
}