
import NextAuth, { NextAuthConfig, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import type { JWT, JWTDecodeParams } from 'next-auth/jwt'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import type { Authentication } from '@/domain/authentication/model'
import type { AuthenticationUserExitsDto, AuthenticationValidateCredentialsDto } from '@/application/dto/authentication'

import { AuthenticationEntity } from '@/domain/authentication/entity'

import { AuthenticationService } from '@/application/services/authentication'

const AUTH_SECRET = process.env.AUTH_SECRET ?? ''

export const authConfigProviders = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      authorize: async ({ email, password }) => {
        const nextAuthCredentials = { email, password }

        try {
          const { email, password } = nextAuthCredentials as Authentication

          const authenticationEntity = new AuthenticationEntity({ email, password })
          const authenticationService = new AuthenticationService()

          const authenticationValidateCredentialsDto = { email: authenticationEntity.email, password: authenticationEntity.password } as AuthenticationValidateCredentialsDto
          const isValidAuthenticationCredetials = await authenticationService.validateAuthenticationCredentials(authenticationValidateCredentialsDto)

          if (!isValidAuthenticationCredetials)
            return null

        } catch (error) {
          console.error(error)
          return null
        }

        return { email } as User                                       
      },
    })
  ],
} satisfies NextAuthConfig

export const { 
  handlers: authenticationHandlers,
  signIn: authenticationSignIn, 
  signOut: authenticationSignOut, 
  auth: authenticationSession,
} = NextAuth({
  pages: {
    signIn: '/sign-in'
  },
  session: { strategy: 'jwt' },
  jwt: {
    encode: async ({ token }) => { 
      if (!token) 
        return ''
      
      return jwt.sign(token as object, AUTH_SECRET, {
        algorithm: 'HS256',
      })
    },
    decode: async ({ token }: JWTDecodeParams): Promise<JWT | null> => {
      try {
        if (!token) 
          return null

        const authenticationService = new AuthenticationService()

        if (authenticationService.checkIsJweToken(token)) 
          return null
        
        return jwt.verify(token, AUTH_SECRET) as JwtPayload as JWT;
      } catch (error) {
        console.error('JWT verification failed:', error)
        return null
      }
    }
  },
  callbacks: {
    async signIn({ user: { email }, account }) {
      if (account?.provider !== 'credentials') 
        return true

      if (!(typeof email === 'string' && email))
        return false

      const authenticationService = new AuthenticationService()

      try {
        const isUserExists = await authenticationService.isUserExists(email as AuthenticationUserExitsDto)

        return isUserExists
      } catch (error) {
        console.error(error)
        return false
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user?.email) 
        token.email = user.email

      if (account?.provider === 'github' && profile?.email) 
        token.email = profile.email
      

      return token
    },
    async session({ token: { sub, email }, session }) {
      if (sub && session.user) 
        session.user.id = sub
      
      const isValidSessionAndEmail = (!!session && !!email) && typeof email === 'string'

      if (!isValidSessionAndEmail) 
        return session

      session.user.email = email

      return session
    },
  },
  ...authConfigProviders
})
