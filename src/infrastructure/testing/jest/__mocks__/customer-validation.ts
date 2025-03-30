import { patternMismatchValidatorMock, requiredValidatorMock, tooShortValidatorMock } from './validations'

export const customerValidationMock = {
  commonValidationRules: {
    name: [ requiredValidatorMock, tooShortValidatorMock ],
    email: [ requiredValidatorMock, patternMismatchValidatorMock ],
    birthday: [ requiredValidatorMock ],
    cpf: [ requiredValidatorMock, patternMismatchValidatorMock ],
    rg: [ requiredValidatorMock, patternMismatchValidatorMock ],
    phone: [ requiredValidatorMock, patternMismatchValidatorMock ],
    addresses: [ requiredValidatorMock ]
  },
  validateEntity: jest.fn(),
  validateDto: jest.fn(),
  validateCreationDto: jest.fn(),
  validateUpdateDto: jest.fn(),
  validateRemovalDto: jest.fn()
}