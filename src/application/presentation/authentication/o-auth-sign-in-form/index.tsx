'use client'
import { startTransition, useState, type FC, type JSX } from 'react'
import { signIn } from 'next-auth/react'

import type { BaseFormProps } from '@/application/presentation/shared/ui/form/index.d'

import { mergeClassNames } from '@/utils/classname'

import Form from '@/application/presentation/shared/ui/form'
import BaseButton from '@/application/presentation/shared/ui/button'
import Spinner from '@/application/presentation/shared/ui/spinner'

type OAuthSignInFormProps = BaseFormProps<unknown>

const OAuthSignInForm: FC<OAuthSignInFormProps> = ({ className }): JSX.Element => {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)
  
  const handleOAuthSignInButtonClick = () => 
    startTransition(() => {
      setIsSubmitting(true)

      signIn('github')
        .catch(error => console.error('OAuth Sign-in failed:', error))
        .finally(() => 
          setTimeout(
            () => setIsSubmitting(false), 
            1000
          )
        )
    })

  return <Form 
    className={
      mergeClassNames('flex bg-transparent', className)
    }
    submitClassName='hidden'
  >
    <BaseButton 
      className='flex justify-evenly items-center w-full max-w-44 h-8 rounded-lg bg-primary-600'
      type='submit'
      onClick={handleOAuthSignInButtonClick}
    >
      { isSubmitting ? 
          <Spinner colored={false} variant='mini' /> 
        : 
        <>
          Entrar com GitHub
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
            <path fillRule='evenodd' clipRule='evenodd' d='M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.805 1.304 3.49.997.11-.775.42-1.304.76-1.604-2.665-.303-5.467-1.334-5.467-5.93 0-1.31.467-2.38 1.236-3.22-.124-.303-.536-1.523.116-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.3-1.23 3.3-1.23.652 1.653.24 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.82 1.102.82 2.22 0 1.604-.015 2.896-.015 3.29 0 .32.22.69.825.575 4.765-1.58 8.2-6.08 8.2-11.38 0-6.63-5.37-12-12-12z' />
          </svg>
        </> 
      } 
    </BaseButton>
  </Form>
}

export default OAuthSignInForm
