import type { FC, JSX } from 'react'

import { mergeClassNames } from '@/utils/classname'

interface AddIconProps {
  className?: string
}

const AddIcon: FC<AddIconProps> = ({ className }): JSX.Element => 
  <span 
    aria-label='Adicionar Cliente'
    className={
      mergeClassNames('text-sm text-black', className)
    }
  >
    ➕
  </span>

export default AddIcon
