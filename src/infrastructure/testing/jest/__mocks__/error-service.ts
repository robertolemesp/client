export const errorServiceMock = {
  isSystemError: jest.fn(() => true),
  generateServiceError: jest.fn((_, __, message) => new Error(message)),
  getServiceErrorMessage: jest.fn((map, key) => map[key])
}
