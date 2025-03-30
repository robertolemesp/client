import type { FC, JSX } from 'react'
import { redirect } from 'next/navigation'

import { authenticationSession } from '@/application/services/authentication/next-auth'

import CredentialsSignInForm from '@/application/presentation/authentication/credentials-sign-in-form'
import OAuthSignInForm from '@/application/presentation/authentication/o-auth-sign-in-form'

const SignInPage: FC = async (): Promise<JSX.Element> => {
  const authSession = await authenticationSession()

  if (authSession) 
    redirect('/')

  return <div className='flex flex-col w-[96%] max-w-[475px] h-[500px] m-auto border rounded-lg bg-secondary-600 text-white'>
    <CredentialsSignInForm />
    <OAuthSignInForm className='w-full justify-end mb-3 pr-3' />
  </div>
}

export default SignInPage
