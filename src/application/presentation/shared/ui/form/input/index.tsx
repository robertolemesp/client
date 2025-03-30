import type { InputHTMLAttributes, FC, ReactNode } from 'react'

import { mergeClassNames } from '@/utils/classname'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
  error?: boolean
  children?: ReactNode
}

const FormInput: FC<FormInputProps> = ({ containerClassName = '', className, error, children, ...props }): ReactNode => 
  <div className={`flex ${containerClassName}`}>
    <input
      className={mergeClassNames(
        `block w-full p-3 text-md rounded-md tracking-wider border border-input text-black ring-offset-primary-500
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1
        ${error 
          ? 'error border-red-600 placeholder-red-600 focus:ring-red-600 focus:border-red-600 ring-2 ring-red-600'
          : 'border-gray-300 placeholder-gray-700 focus:border-primary-600 focus:ring-primary-600'
        }`, 
        className
      )}
      { ...props }
    />
    { children }
  </div>

export default FormInput
