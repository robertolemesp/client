'use client'
import { startTransition, SyntheticEvent, useState, type FC, type JSX } from 'react'
import { signIn } from 'next-auth/react' // using this due next canary version compatibility
import { redirect } from 'next/navigation'

import type { AuthenticationSignInDto, NextAuthProvider } from '@/application/dto/authentication'

import type { BaseFormProps } from '@/application/presentation/shared/ui/form/index.d'

import { mergeClassNames } from '@/utils/classname'

import { parseFormData } from '@/utils/form'

import Form from '@/application/presentation/shared/ui/form'
import FormInput from '@/application/presentation/shared/ui/form/input'

type SignInFormProps = BaseFormProps<unknown>

const CredentialsSignInForm: FC<SignInFormProps> = ({ className }): JSX.Element => {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => 
    startTransition(() => 
      (<P extends NextAuthProvider, R extends boolean = true> () => {
        setIsSubmitting(true)
        const formData = new FormData(event.currentTarget)

        signIn('credentials', { 
          ...parseFormData<AuthenticationSignInDto<P, R>>(formData), 
          redirect: false 
        }).then(signInResult => {
          if (!signInResult?.ok) {
            alert('Falha ao entrar')
            return
          }
          
          redirect('/')
        })
        .finally(() => 
          setTimeout(
            () => setIsSubmitting(false), 
            1000
          )
        )
      })()
    )
  
  return <Form 
    className={
      mergeClassNames('flex flex-col justify-center relative px-6 h-full w-full gap-y-6', className)
    }
    submitClassName='credentials-form-submit w-full text-md'
    submitTitle='Entrar'
    onSubmit={handleFormSubmit}
    isSubmitting={isSubmitting}
  >
    <h1 className='absolute top-12 fluid-text-xl font-bold mx-auto'>Bem vindo</h1>
    <FormInput 
      name='email'
      placeholder='Coloque o e-mail'
      type='text'
    />
    <FormInput 
      name='password'
      placeholder='Coloque a senha'
      type='password'
    />
  </Form>
}

export default CredentialsSignInForm
