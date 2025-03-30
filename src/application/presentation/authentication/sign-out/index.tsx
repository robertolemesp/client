'use client'
import { type FC, type JSX, useState, startTransition } from 'react'
import { signOut } from 'next-auth/react'

import { mergeClassNames } from '@/utils/classname'

import Spinner from '@/application/presentation/shared/ui/spinner'

interface SignOutProps {
  className?: string
}

const SignOut: FC<SignOutProps> = ({ className }): JSX.Element => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const handleSignOutButtonClick = () => 
    startTransition(() => {
      setIsLoading(true)

      signOut({ redirectTo: '/sign-in' })
        .catch(error => console.error('Sign-out failed:', error))
        .finally(() => 
          setTimeout(
            () => setIsLoading(false), 
            1000
          )
        )
    })
    
  return <button 
    className={mergeClassNames('sign-out-button flex items-center gap-2 p-2 transition cursor-pointer', className)} 
    onClick={handleSignOutButtonClick}
  >
    { isLoading ? <Spinner variant='small' /> : 'Sair ➜' }
  </button>
}

export default SignOut
