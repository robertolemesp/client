import type { FC, ButtonHTMLAttributes, JSX, ReactNode } from 'react'

import { mergeClassNames } from '@/utils/classname'

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onClick: () => void
}

const BaseButton: FC<BaseButtonProps> = ({ className, onClick, children, ...props }): JSX.Element => 
  <button
    type='button'
    onClick={onClick}
    className={
      mergeClassNames(
        'flex items-center justify-center w-32 h-12 font-bold rounded-lg text-sm text-center text-white bg-primary-600 focus:outline-none',
        className
      )
    }
    { ...props }
  >
    { children }
  </button>

export default BaseButton
