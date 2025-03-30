import { authenticationServiceErrorMessages, AuthenticationServiceErrors, type AuthenticationServiceInterface } from './types'
import type { BuiltInProviderType } from 'next-auth/providers'

import type { ServiceErrorOrigin } from '@/domain/error/model'

import type { 
  AuthenticationDto,
  AuthenticationUserExitsDto, AuthenticationUserExitsResultDto, 
  AuthenticationValidateCredentialsDto, AuthenticationValidateCredentialsResultDto, 
  AuthenticationSignOutDto, AuthenticationSignOutResultDto,
  AuthenticationSignInDto, AuthenticationSignInResultDto
} from '@/application/dto/authentication'

import { authenticationSignIn, authenticationSignOut } from '@/application/services/authentication/next-auth'
import { AuthenticationValidator } from '@/domain/authentication/services/validation'

import { errorService } from '@/application/services/error'

import HttpClient from '@/infrastructure/api/http-client'


export class AuthenticationService implements AuthenticationServiceInterface {
  private ERROR_ORIGIN: ServiceErrorOrigin = 'Service Authentication'

  private JWE_TOKEN_LENGHT = 5

  private INTERNAL_SERVER_URL = 'http://localhost:3000'

  private httpClient = HttpClient.getInstance()

  constructor() {}
  
  async getSessionAccessToken(): Promise<string | null> {
    try {    
      const response = await fetch(`${this.INTERNAL_SERVER_URL}/api/auth/token`)
  
      if (!response.ok) {
        console.error(response)
        return null
      }
      
      const jsonResponse = await response.json()
       
      return jsonResponse?.token ?? null
    } catch (error) {
      console.error('Error fetching authentication token:', error)
      return null
    }
  }

  async isUserExists(email: AuthenticationUserExitsDto): Promise<AuthenticationUserExitsResultDto> {
    try {      
      if (!email)
        throw new Error('User email is mandatory')

      const { data: result } = await this.httpClient.post<AuthenticationUserExitsResultDto>('/customer/exists', { email })

      return result as unknown as AuthenticationUserExitsResultDto
    } catch (error) {
      if (errorService.isSystemError(error)) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getAuthenticationServiceErrorMessage(AuthenticationServiceErrors.IS_USER_EXISTS)
        )

      throw error
    }
  }

  async validateAuthenticationCredentials(credentialsDto: AuthenticationValidateCredentialsDto): Promise<AuthenticationValidateCredentialsResultDto> {
    try {      
      AuthenticationValidator.validateCredentialsDto(credentialsDto)

      const { data: result } = await this.httpClient.post<AuthenticationValidateCredentialsResultDto>('/customer/credentials', credentialsDto)

      return result
    } catch (error) {
      if (errorService.isSystemError(error)) 
        throw errorService.generateServiceError(
          this.ERROR_ORIGIN, 
          error.payload, 
          this.getAuthenticationServiceErrorMessage(AuthenticationServiceErrors.VALIDATE_AUTHENTICATION_CREDENTIALS)
        )

      throw error
    }
  }

  async signIn<P extends BuiltInProviderType | (string & {}), R extends boolean = true>(
    authenticationSignInDto: AuthenticationSignInDto<P, R>
  ): AuthenticationSignInResultDto<R> {
    const { email, password } = (authenticationSignInDto.options || authenticationSignInDto) as AuthenticationDto

    AuthenticationValidator.validateDto({ email, password })
    
    try {
      return await authenticationSignIn('credentials', { email, password, redirect: false })
    } catch (error) {
      throw errorService.generateServiceError(
        this.ERROR_ORIGIN, 
        error, 
        this.getAuthenticationServiceErrorMessage(AuthenticationServiceErrors.SIGN_IN)
      )
    }
  }

  async signOut<R extends boolean = true>(authenticationSignOutDto?: AuthenticationSignOutDto<R>): AuthenticationSignOutResultDto<R> {
    try {
      return await authenticationSignOut(authenticationSignOutDto)
    } catch (error) {
      if (error instanceof Error)
        throw new Error(error.message)

      throw errorService.generateServiceError(
        this.ERROR_ORIGIN, 
        error, 
        this.getAuthenticationServiceErrorMessage(AuthenticationServiceErrors.SIGN_OUT)
      )
    }
  }

  checkIsJweToken = (token: string): boolean =>  token.split('.').length === this.JWE_TOKEN_LENGHT

  getAuthenticationServiceErrorMessage = (errorType: AuthenticationServiceErrors): string => 
    errorService.getServiceErrorMessage(authenticationServiceErrorMessages, errorType)
}
