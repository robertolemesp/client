import type { FC, JSX, PropsWithChildren } from 'react'

const FormError: FC<PropsWithChildren> = ({ children }): JSX.Element => 
  <p className='mt-2 text-red-600 dark:text-red-500'>
    { children }
  </p>

export default FormError
