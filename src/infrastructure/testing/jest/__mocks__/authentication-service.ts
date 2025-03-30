import type { AuthenticationServiceErrors, AuthenticationServiceInterface } from '@/application/services/authentication/types'
import type { AuthenticationUserExitsDto, AuthenticationValidateCredentialsResultDto, AuthenticationValidateCredentialsDto } from '@/application/dto/authentication'

export const authenticationServiceMock: AuthenticationServiceInterface = {
  getSessionAccessToken: jest.fn<Promise<string | null>, []>(),
  isUserExists: jest.fn<Promise<boolean>, [AuthenticationUserExitsDto]>(),
  validateAuthenticationCredentials: jest.fn<Promise<AuthenticationValidateCredentialsResultDto>, [AuthenticationValidateCredentialsDto]>(),
  signIn: jest.fn() as unknown as AuthenticationServiceInterface['signIn'],
  signOut: jest.fn() as unknown as AuthenticationServiceInterface['signOut'],
  checkIsJweToken: jest.fn<boolean, [string]>(),
  getAuthenticationServiceErrorMessage: jest.fn<string, [AuthenticationServiceErrors]>()
}

export const nextAuthMock = {
  authenticationSignIn: jest.fn(),
  authenticationSignOut: jest.fn()
}
