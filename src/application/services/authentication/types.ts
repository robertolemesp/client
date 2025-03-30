import type { BuiltInProviderType } from 'next-auth/providers'
import type { 
  AuthenticationUserExitsDto, AuthenticationUserExitsResultDto, 
  AuthenticationValidateCredentialsDto, AuthenticationValidateCredentialsResultDto,
  AuthenticationSignInDto, AuthenticationSignInResultDto,
  AuthenticationSignOutDto, AuthenticationSignOutResultDto
} from '@/application/dto/authentication'


export interface AuthenticationServiceInterface {
  getSessionAccessToken(): Promise<string | null>
  isUserExists(email: AuthenticationUserExitsDto): Promise<AuthenticationUserExitsResultDto>
  validateAuthenticationCredentials(credentials: AuthenticationValidateCredentialsDto): Promise<AuthenticationValidateCredentialsResultDto>
  signIn<P extends BuiltInProviderType | 'credentials' | 'github' | (string & {}), R extends boolean = true>(authenticationSignInDto: AuthenticationSignInDto<P, R>): AuthenticationSignInResultDto<R>
  signOut<R extends boolean = true>(authenticationSignOutDto?: AuthenticationSignOutDto<R>): AuthenticationSignOutResultDto<R>
  checkIsJweToken (token: string): boolean 
  getAuthenticationServiceErrorMessage(errorType: AuthenticationServiceErrors): string
}

export enum AuthenticationServiceErrors {
  GET_SESSION_ACCESS_TOKEN = 'GET_SESSION_ACCESS_TOKEN',
  IS_USER_EXISTS = 'IS_USER_EXISTS',
  VALIDATE_AUTHENTICATION_CREDENTIALS = 'VALIDATE_AUTHENTICATION_CREDENTIALS',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT'
}

export const authenticationServiceErrorMessages: Record<AuthenticationServiceErrors, string> = {
  [AuthenticationServiceErrors.GET_SESSION_ACCESS_TOKEN]: 'Failed to get session access token',
  [AuthenticationServiceErrors.IS_USER_EXISTS]: 'Failed to check if user exists',
  [AuthenticationServiceErrors.VALIDATE_AUTHENTICATION_CREDENTIALS]: 'Failed to validate authentication credentials',
  [AuthenticationServiceErrors.SIGN_IN]: 'Failed to sign in',
  [AuthenticationServiceErrors.SIGN_OUT]: 'Failed to sign out'
}
