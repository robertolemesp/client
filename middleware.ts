import { type NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'

import { authConfigProviders } from '@/application/services/authentication/next-auth'

const { auth: nextAuthSession } = NextAuth(authConfigProviders)

const PRIVATE_ROUTES = ['/']

export async function middleware({ nextUrl, url }: NextRequest) {
  const { pathname } = nextUrl
  
  const authenticationSession = await nextAuthSession()

  const isPrivateRoute = PRIVATE_ROUTES.some(privateRoute => pathname.startsWith(privateRoute))

  if (isPrivateRoute && !authenticationSession)
    return NextResponse.redirect(new URL('/api/auth/sign-in', url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
