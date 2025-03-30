import type { FC } from 'react'

interface RemoveIconProps {
  onClick: () => void
}

const RemoveIcon: FC<RemoveIconProps> = ({ onClick }) => (
  <span
    className='remove-customer-icon text-xl text-red-500 cursor-pointer'
    aria-label='Remove'
    onClick={onClick}
  >
    ❌
  </span>
)

export default RemoveIcon
