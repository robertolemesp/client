import type { FC } from 'react'
import { redirect } from 'next/navigation'

import { authenticationSession } from '@/application/services/authentication/next-auth'

import CustomerPageContent from '@/application/presentation/customer/page-content'

const MainPage: FC = async () => {
  const authSession = await authenticationSession()

  if (!authSession)
    redirect('/sign-in')

  return <CustomerPageContent />
}

export default MainPage
