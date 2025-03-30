import type { User } from 'next-auth'
import type { BuiltInProviderType } from 'next-auth/providers'

export type AuthenticationUserEmail = Pick<User, 'email'>

export type NextAuthProvider = BuiltInProviderType | (string & {})

export type AuthenticationDto = { email?: AuthenticationUserEmail, password?: string  }

export type AuthenticationSignInDto<
  P extends NextAuthProvider,
  R extends boolean = true
> = { 
  provider?: P,
  options?: FormData | { redirectTo?: string, redirect?: R } & Record<string, unknown>,
  authorizationParams?: string[][] | Record<string, string> | string | URLSearchParams 
}
export type AuthenticationSignInResultDto<R extends boolean = true> = Promise<R extends false ? unknown : never>

export type AuthenticationUserExitsDto = AuthenticationUserEmail
export type AuthenticationUserExitsResultDto = boolean

export type AuthenticationValidateCredentialsDto = AuthenticationDto
export type AuthenticationValidateCredentialsResultDto = boolean

export type AuthenticationSignOutDto<R extends boolean = true> = { redirectTo?: string, redirect?: R }
export type AuthenticationSignOutResultDto<R extends boolean = true> = Promise<R extends false ? unknown : never>
