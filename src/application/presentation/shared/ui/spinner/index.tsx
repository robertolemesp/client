import type { FC } from 'react'

import { mergeClassNames } from '@/utils/classname'

interface SpinnerProps {
  className?: string
  variant?: 'mini' | 'small' | 'medium' | 'large'
  colored?: boolean
}

const Spinner: FC<SpinnerProps> = ({ className, variant = 'medium', colored = true }) => {
  const sizeClassesList: Record<typeof variant, string> = {
    mini: 'w-5 h-5',
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const sizeClasses = sizeClassesList[variant]

  const colorClasses = colored ? 'border-primary-600 border-t-black' : 'border-white border-t-black'

  return <div role='status'
    className={
      mergeClassNames(
        'border-4 rounded-full animate-spin', 
        sizeClasses, 
        colorClasses,
        className
      )
    } 
  />
}

export default Spinner
