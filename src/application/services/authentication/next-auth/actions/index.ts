'use server'
import { AuthError } from 'next-auth'
import type { BuiltInProviderType } from 'next-auth/providers'

import type { AuthenticationSignInDto, NextAuthProvider } from '@/application/dto/authentication'

import { AuthenticationService } from '@/application/services/authentication'

import { parseFormData } from '@/utils/form'


export const credentialsSignInformSubmitAction = async<
  P extends NextAuthProvider, 
  R extends boolean = true
>
(_prevState: unknown, payload: FormData): Promise<void> => {
  const authenticationService = new AuthenticationService()
  
  const parsedFormData = parseFormData<AuthenticationSignInDto<P, R>>(payload)

  const DEFAULT_AUTHENTICATION_SIGN_IN_ERROR = new Error('Failed to sign in with credentials')

   try {
    await authenticationService.signIn<P, R>({ provider: 'credentials' as P, options: parsedFormData })
   } catch (error) {
     if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid credentials')
        default:
          throw DEFAULT_AUTHENTICATION_SIGN_IN_ERROR
      }
    }

    if (error instanceof Error) {
      console.error(error)
      throw new Error(error.message)
    }

    throw DEFAULT_AUTHENTICATION_SIGN_IN_ERROR
  }
}

export const oAuthSignInformSubmitAction = async<
  P extends BuiltInProviderType | (string & {}), 
  R extends boolean = true
>
(_prevState: unknown, payload: FormData): Promise<void> => {
  const authenticationService = new AuthenticationService()
  
  const parsedFormData = parseFormData<AuthenticationSignInDto<P, R>>(payload)

  const DEFAULT_AUTHENTICATION_OAUTH_SIGN_IN_ERROR = new Error('Failed to oAuth sign in with github')

   try {
    await authenticationService.signIn<P, R>(parsedFormData)
   } catch (error) {
     if (error instanceof AuthError) 
        throw DEFAULT_AUTHENTICATION_OAUTH_SIGN_IN_ERROR
  
    if (error instanceof Error) {
      console.error(error)
      throw new Error(error.message)
    }

    throw DEFAULT_AUTHENTICATION_OAUTH_SIGN_IN_ERROR
  }
}